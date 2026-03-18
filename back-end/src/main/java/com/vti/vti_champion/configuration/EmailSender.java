package com.vti.vti_champion.configuration;

import com.vti.vti_champion.dto.mail.CodeSender;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class EmailSender {
    private final MailService mailService;

    @Async("codeExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleSendCode(CodeSender codeSender) {
        mailService.sendCode(codeSender.getToEmail(), codeSender.getCode());
    }

}
