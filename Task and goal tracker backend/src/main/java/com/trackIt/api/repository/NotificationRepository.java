package com.trackIt.api.repository;

import com.trackIt.api.dto.response.NotificationResponse;
import com.trackIt.api.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.notificationReceiver = :user ORDER BY n.timestamp DESC")
    List<Notification> findByReceiver(@Param("user") String user);

    Optional<Notification> findByNotificationId(String notificationId);

    @Transactional
    @Modifying
    void deleteByNotificationId(String notificationId);
}
