package com.aichat.repository;

import com.aichat.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for ChatMessage entity
 */
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    /**
     * Find messages by session ID
     */
    List<ChatMessage> findBySessionIdOrderByTimestampAsc(String sessionId);
    
    /**
     * Find messages by user ID
     */
    List<ChatMessage> findByUserIdOrderByTimestampDesc(String userId);
    
    /**
     * Find recent messages by session ID with limit
     */
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.sessionId = :sessionId ORDER BY cm.timestamp DESC")
    List<ChatMessage> findRecentBySessionId(@Param("sessionId") String sessionId, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Delete messages by session ID
     */
    void deleteBySessionId(String sessionId);
    
    /**
     * Count messages by session ID
     */
    long countBySessionId(String sessionId);
}
