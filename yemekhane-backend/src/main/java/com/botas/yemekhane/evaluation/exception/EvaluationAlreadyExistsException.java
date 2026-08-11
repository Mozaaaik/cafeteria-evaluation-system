package com.botas.yemekhane.evaluation.exception;

public class EvaluationAlreadyExistsException extends RuntimeException {
    public EvaluationAlreadyExistsException() {
        super("Bu menü için daha önce oy kullandınız.");
    }
}
