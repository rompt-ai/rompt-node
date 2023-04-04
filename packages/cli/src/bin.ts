#! /usr/bin/env node

import { pull } from './index';
import arg from 'arg';

const args = arg({
    '--branch': String,
    '--destination': String,
    '--_env': String,
    '--_dry': Boolean,

    '-b': '--branch',
    '-d': '--destination',
});

pull({
    branch: args['--branch'],
    destination: args['--destination'],
    _env: args['--_env'],
    _dry: args['--_dry'],
})
    .then(() => {
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
