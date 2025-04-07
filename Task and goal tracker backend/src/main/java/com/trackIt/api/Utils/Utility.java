package com.trackIt.api.Utils;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Utility {
    private static final DateTimeFormatter FORMATTERDB = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final SecureRandom RANDOM = new SecureRandom();



    public static String generateRandomString() {
        StringBuilder stringBuilder = new StringBuilder(10);
        for (int i = 0; i < 10; i++) {
            int index = RANDOM.nextInt("abcdefghijklm1234".length());
            stringBuilder.append("abcdefghijklm1234".charAt(index));
        }
        return stringBuilder.toString();
    }



    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static String formatLocalDateTime(LocalDateTime dateTime) {
        return dateTime.format(FORMATTER);
    }

    public static String getCurrentFormattedDateTime() {
        LocalDateTime currentDateTime = LocalDateTime.now();
        return formatLocalDateTime(currentDateTime);
    }




}
