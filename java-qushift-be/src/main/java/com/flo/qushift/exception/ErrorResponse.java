package com.flo.qushift.exception;

import java.time.LocalDateTime;

public record ErrorResponse(LocalDateTime timestamp, String message, String details) {
}
