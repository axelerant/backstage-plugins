#!/bin/bash
cp -n ./.devcontainer/devcontainer.env-sample ./.devcontainer/devcontainer.env
cp -n ./app-config.local-sample.yaml ./.app-config.local.yaml
# below line added to handle failure when above files already present
# if file present, cp command return with exit code 1 which breaks the devcontainer startup
echo 0
