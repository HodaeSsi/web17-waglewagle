package com.waglewagle.rest.thread.controller;

import com.waglewagle.rest.keyword.service.KeywordService;
import com.waglewagle.rest.thread.data_object.dto.request.ThreadRequest;
import com.waglewagle.rest.thread.data_object.dto.response.ThreadResponse;
import com.waglewagle.rest.thread.service.ThreadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/v1/thread")
@RequiredArgsConstructor
public class ThreadController {

    private final ThreadService threadService;
    private final KeywordService keywordService;

    /**
     * Thread 생성
     * 11.30
     */
    @PostMapping("")
    @ResponseBody
    public ResponseEntity<String> createThread(@CookieValue("user_id") Long userId,
                                               @RequestBody ThreadRequest.CreateThreadInputDTO createThreadInputDTO) {
        if (!createThreadInputDTO.isValid())
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        
        try {
            threadService.creatThread(userId, createThreadInputDTO);
            return new ResponseEntity<>(null, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Thread 삭제
     * 11.30
     */
    @DeleteMapping("")
    @ResponseBody
    public ResponseEntity<Boolean> deleteThread(@CookieValue("user_id") Long userId,
                                                @RequestBody ThreadRequest.DeleteDTO deleteDTO) {

        threadService.deleteThread(userId, deleteDTO.getThreadId());

        return new ResponseEntity<>(true, HttpStatus.ACCEPTED);
    }

    /**
     * Community Thread 읽기
     * 유저 정보를 함께 줘야한다.
     * Thread {
     * threadId: string
     * content: string
     * user {
     * userId: string
     * username: string
     * profileImageUrl: string
     * }
     * childThreads: Thread[]
     * created_at: Date(?)
     * updated_at: Date(?)
     * }
     */
    @GetMapping("/keyword")
    public ResponseEntity getThreadsInKeyword(@RequestParam("keyword-id") Long keywordId) {

        if (!keywordService.isKeywordExist(keywordId)) {
            // TODO : Error code
            return new ResponseEntity(null, HttpStatus.NOT_FOUND);
        }

        List<ThreadResponse.ThreadDTO> threadResponseDTOS = threadService.getThreadsInKeyword(keywordId);

        if (threadResponseDTOS.isEmpty()) {
            return new ResponseEntity(null, HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity(threadResponseDTOS, HttpStatus.OK);
    }
}