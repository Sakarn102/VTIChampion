package com.vti.vti_champion.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ErrorCode {
    // System Errors

    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),

    // QUESTION (2)
    QUESTION_NOT_FOUND(201, "Question not found", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND(202, "User not found", HttpStatus.NOT_FOUND),

    ;

    private Integer code;
    private String message;
    private HttpStatusCode statusCode;
}
