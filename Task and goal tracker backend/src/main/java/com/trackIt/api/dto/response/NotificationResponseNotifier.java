package com.trackIt.api.dto.response;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponseNotifier {
    private List<String> users;
    private BigInteger count;


}
