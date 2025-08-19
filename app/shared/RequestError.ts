import { ValidationError } from 'yup';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import i18next from "i18next";

export { StatusCodes, ReasonPhrases }
export interface RequestErrorInterface {
    language?: string;
    errors?: Array<string>;
    inner?: ValidationError[];
    errorMessage?: string | ReasonPhrases;
    status?: StatusCodes;
  }
class RequestError extends Error implements RequestErrorInterface{
    #language: string;
    errorMessage: string;
    status: StatusCodes;
    constructor({
        language = 'en-US',
        errors = [],
        inner,
        errorMessage,
        status = StatusCodes.INTERNAL_SERVER_ERROR,
    }: RequestErrorInterface) {
        super(errorMessage);
        Object.assign(this, {
            errors: inner || errors,
            status,
        });
        this.#language = language;
        this.errorMessage = this.toI18n(errorMessage)
            || (inner?.length && inner.map(({ path, errors: errs }) => `${path} ${this.flatErrors(errs)}`).join(', '))
            || this.flatErrors(errors);
    }

    flatErrors(errors) {
        return errors.map((msg) => this.toI18n(msg)).join(', ');        
    }

    toI18n(msg) {
        if (typeof msg === 'string' && i18next.exists(msg)) {
            const t = i18next.getFixedT(this.#language);
            return t(msg)
        }
        return msg;
    }
}

export const  REQUEST_ERRORS = {
    ORDER_NOT_FOUND: new RequestError({ status: StatusCodes.INTERNAL_SERVER_ERROR, errorMessage: 'order not found' }),
    ORDER_CAN_NOT_CREATE: new RequestError({ status: StatusCodes.INTERNAL_SERVER_ERROR, errorMessage: 'order can not create' }),
}

export default RequestError;