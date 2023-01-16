package com.flo.qushift.service;

import com.flo.qushift.document.Message;
import com.flo.qushift.repository.ReactiveMessageRepository;
import com.flo.qushift.serializer.LocalDateTimeSerializer;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.scheduler.Schedulers;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class BackupService {

    private final ReactiveMessageRepository messageRepository;

    public String writeBackupFile(String topicId) {
        List<Message> messages = new ArrayList<>();

        messageRepository.findAllByTopicId(topicId)
                .publishOn(Schedulers.boundedElastic())
                .collectList()
                .flatMapMany(Flux::just)
                .subscribe(messages::addAll);

        Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeSerializer())
                .create();
        String json = gson.toJson(messages);

        try (FileOutputStream binFile = new FileOutputStream("data.dat");
             FileChannel binChannel = binFile.getChannel()) {

            byte[] outputBytes = json.getBytes();
            ByteBuffer buffer = ByteBuffer.wrap(outputBytes);
            int numBytes = binChannel.write(buffer);

            // TODO Upload file to S3
            return "data.dat";
        } catch (IOException e) {
            log.error("Cannot write .dat file for " + topicId, e);
            throw new RuntimeException(e);
        }
    }

    public ByteArrayResource exportBackupFile(String locFile) {
        try (RandomAccessFile raf = new RandomAccessFile(locFile, "rwd");
             FileChannel binChannel = raf.getChannel();
             ByteArrayOutputStream baOut  = new ByteArrayOutputStream()) {

            int bufferSize = 1024;
            if (bufferSize > binChannel.size()) {
                bufferSize = (int) binChannel.size();
            }
            ByteBuffer buffer = ByteBuffer.allocate(bufferSize);

            StringBuffer stringBuffer = new StringBuffer();
            while (binChannel.read(buffer) > 0) {
                stringBuffer.append(new String(buffer.array()));
                buffer.clear();
            }

            baOut.write(stringBuffer.toString().getBytes());
            return new ByteArrayResource(baOut.toByteArray());
        } catch (IOException e) {
            log.error("Cannot read .dat file");
            throw new RuntimeException(e);
        }
    }
}
