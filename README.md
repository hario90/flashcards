# Template Electron React App

Template for creating desktop application using electron and react.

## Setup

create a new repository in bit bucket
```commandline
git clone <ssh:....>
git remote add template ssh://git@stash.corp.alleninstitute.org:7999/aicssw/template-electron-react.gitgit fetch template
git merge template/master
```


./gradlew runElectron

If on Linux: apt-get install libgconf-2-4


## Note

This is still a work in progress but can be forked off of to get going. 
Some additional items planned:

* set up Jenkinsfile and build
* improve dev experience (add HMR)
* fix tests
* add webpack stats
* more main process examples
* setup and test packaging app into executable
* more webpack chunks splitting?