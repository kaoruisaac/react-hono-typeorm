import { setLocale } from 'yup';
import * as employee from './employee';

setLocale({
    mixed: {
        required: () => 'is-required',
    },
    string: {
        max: ({ max }) => ['should-not-be-longer-then-character', { arg: max }],
        min: ({ min }) => ['should-not-be-shorter-then-character', { arg: min }],
        email: () => 'should-be-email-format',
    },
    array: {
        max: ({ max }) => ['should-not-be-more-then-item', { arg: max }],
        min: ({ min }) => ['should-not-be-fewer-then-item', { arg: min }],
    }
});

export default {
    employee,
};