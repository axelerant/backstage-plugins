# Use the existing TypeScript and Node.js image as the parent image
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:18

# Set the working directory inside the container
WORKDIR /workspace

# Install techdoc requirements
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip3 install mkdocs-techdocs-core

# https://pypi.org/project/plantuml-markdown/
RUN curl -L https://raw.githubusercontent.com/riboseinc/plantuml-install/master/ubuntu.sh | bash
