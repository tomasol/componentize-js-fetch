{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = import nixpkgs {
            inherit system;
          };
          commonDeps = with pkgs; [
            pkg-config
            wasm-tools
            wasmtime
            curlMinimal
            nodejs_22
            wizer
          ];
        in
        {
          devShells.default = pkgs.mkShell {
            nativeBuildInputs = commonDeps;
          };
        }
      );
}
