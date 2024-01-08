{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    treefmt-nix.url = "github:numtide/treefmt-nix";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      systems = ["x86_64-linux"];
      imports = [
        inputs.treefmt-nix.flakeModule
      ];
      perSystem = {
        config,
        pkgs,
        ...
      }: let
        projects = ["availability-service" "notification-service" "booking-service"];
        forEachProject = pkgs.lib.genAttrs projects;
        buildInputs = with pkgs; [
          nodejs_20
        ];
      in {
        packages = forEachProject (project:
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

        treefmt.config = {
          projectRootFile = "flake.nix";
          programs = {
            alejandra.enable = true;
            prettier.enable = true;
          };
        };

        devShells.default = pkgs.mkShell {
          inherit buildInputs;
          inputsFrom = [config.treefmt.build.devShell];

          packages = with pkgs; [
            nil #nix language server
            k6 #load testing for the backend
          ];
        };
      };
    };
}
