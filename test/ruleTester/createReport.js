import { AssertionError } from "node:assert";
import { parseErrorMessage } from "./parseErrorMessage.js";

const PARSING_ERROR_CHUNK =
	"A fatal parsing error occurred: Parsing error: Unexpected token";

const isParsingError = (error) => {
	return error.message.includes(PARSING_ERROR_CHUNK);
};

export const createReport = (error, useCase) => {
	const ErrorClass = Object.getPrototypeOf(error).constructor;
	console.log(useCase.type, error);

	if (useCase.type !== "parsing" && isParsingError(error)) {
		return {
			...error,
			...useCase,
			error: error,
			errorType: "ParsingError",
		};
	}
	if (ErrorClass === AssertionError) {
		return {
			...error,
			...useCase,
			...parseErrorMessage(error),
			error: error,
			errorType: "AssertionError",
		};
	}
	return {
		error,
		errorType: "UnexpectedError",
	};
};
