import { Node20ReactTypeScriptProject } from "dkershner6-projen";
import { TextFile } from "projen";
import { Nvmrc } from "projen-nvm";

const PACKAGE_NAME = "amplify-authenticator-react-custom";

const DEV_AND_PEER_DEPENDENCIES = [
    "@aws-amplify/auth@5",
    "@aws-amplify/core@5",
    "amazon-cognito-identity-js@5",
    "react-script-hook",
    "tiny-invariant",
];
const DEV_DEPENDENCIES = [
    ...DEV_AND_PEER_DEPENDENCIES,
    "dkershner6-projen",
    "projen-nvm",
    "jest-mock",
];
const PEER_DEPENDENCIES = [...DEV_AND_PEER_DEPENDENCIES];

const project = new Node20ReactTypeScriptProject({
    majorVersion: 1,

    defaultReleaseBranch: "main",
    name: PACKAGE_NAME,
    keywords: ["aws", "amplify", "react", "auth", "authentication", "custom"],
    description:
        "A set of hooks and a component to easily implement completely custom auth components.",
    homepage: `https://github.com/dkershner6/${PACKAGE_NAME}#readme`,
    bugsUrl: `https://github.com/dkershner6/${PACKAGE_NAME}/issues`,
    authorName: "Derek Kershner",
    authorUrl: "https://dkershner.com",
    repository: `git+https://github.com/dkershner6/${PACKAGE_NAME}.git`,
    projenrcTs: true,

    devDeps: DEV_DEPENDENCIES,
    peerDeps: PEER_DEPENDENCIES,

    release: true,
    releaseToNpm: true,
    github: true,

    docgen: true,
});

new Nvmrc(project);

new TextFile(project, ".github/CODEOWNERS", { lines: ["* @dkershner6"] });

project.synth();
