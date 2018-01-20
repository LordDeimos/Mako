# Mako Comic Reader
[![Build Status](https://travis-ci.org/LordDeimos/Mako.svg?branch=master)](https://travis-ci.org/LordDeimos/Mako) [![Build status](https://ci.appveyor.com/api/projects/status/dt9x751u4dasgjfe?svg=true)](https://ci.appveyor.com/project/LordDeimos/mako) [![dependencies Status](https://david-dm.org/LordDeimos/Mako/status.svg)](https://david-dm.org/LordDeimos/Mako) [![devDependencies Status](https://david-dm.org/LordDeimos/Mako/dev-status.svg)](https://david-dm.org/LordDeimos/Mako?type=dev)

## Installation
* ### Windows

   Run the setup exe and you're all set!
* ### Linux
   For GNU-Linux distributions
   ```sh
   sudo dpkg -i mako_0.0.1_amd64.deb
   ```
   Currently only a deb package is provided, however tarballs will be in future releases.
* ### Build From Source
   
   ```sh
      git clone https://github.com/LordDeimos/Mako
      cd Mako
      git checkout v0.0.1 #For the current build, ignore if you want to test the dev version
      yarn && yarn dist
   ```
   Outputs the current (or dev) build for your operating system to the Mako/dist folder.
