# Mako Comic Reader
[![Build Status](https://travis-ci.org/LordDeimos/Mako.svg?branch=master)](https://travis-ci.org/LordDeimos/Mako) [![Build status](https://ci.appveyor.com/api/projects/status/dt9x751u4dasgjfe?png=true)](https://ci.appveyor.com/project/LordDeimos/mako) [![dependencies Status](https://david-dm.org/LordDeimos/Mako/status.svg)](https://david-dm.org/LordDeimos/Mako) [![devDependencies Status](https://david-dm.org/LordDeimos/Mako/dev-status.svg)](https://david-dm.org/LordDeimos/Mako?type=dev)

## Installation
* ### Windows
   Run the setup exe and you're all set!
* ### Linux
   For GNU-Linux distributions
   ```sh
   sudo apt-get install libarchive13
   sudo dpkg -i mako_*_amd64.deb
   ```
   From tarball:
   ```sh
   tar xvzC /path/of/choice -f mako_*_amd64.tar.gz
   ```
* ### Build From Source
   
   For Linux, you will need to grab the libarchive-dev package:
   ```sh
   sudo apt-get install libarchive-dev
   ```
   For Windows, libarchive binaries are provided, but you will need some things required by archive-manager (see [here](https://github.com/LordDeimos/Node-Archive-Manager)).

   ```sh
   git clone https://github.com/LordDeimos/Mako
   cd Mako
   git checkout v0.1.0 #For the current build, ignore if you want to test the dev version
   yarn && yarn dist
   ```
   Outputs the current (or dev) build for your operating system to the Mako/dist folder.
