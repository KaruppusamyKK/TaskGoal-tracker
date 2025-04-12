package com.trackIt.api.dto.response;
import com.trackIt.api.dto.UserTaskDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {

    private List<NotificationResponse> notificationResponse;

    private List<UserTaskDto> userTaskDtoList;
}
