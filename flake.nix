{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    projects = ["availability-service" "notification-service" "booking-service"];
    forEachProject = nixpkgs.lib.genAttrs projects;
    pkgs = nixpkgs.legacyPackages.${system};
    buildInputs = with pkgs; [
      nodejs_20
    ];
  in {
    packages.${system} = forEachProject (project:
      pkgs.buildNpmPackage {
        inherit buildInputs;

        version = "0.1.0";
        dontNpmBuild = true;
        pname = project;
        postInstall = ''
          mkdir -p $out/bin
          exe="$out/bin/${project}"
          lib="$out/lib/node_modules/${project}"
          touch $exe
          chmod +x $exe
          echo "
              #!/usr/bin/env bash
              cd $lib
              ${pkgs.nodejs_20}/bin/node ./app.js" > $exe
        '';
        npmDepsHash = builtins.readFile ./${project}/hash;
        src = ./. + "/${project}";
      });

    devShells.${system}.default = pkgs.mkShell {
      inherit buildInputs;

      packages = with pkgs; [
        nil #nix language server
        alejandra #nix formatter
        k6 #load testing for the backend
      ];
    };
  };
}
