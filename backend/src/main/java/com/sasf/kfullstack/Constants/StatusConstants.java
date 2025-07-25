package com.sasf.kfullstack.Constants;

import java.util.List;

public class StatusConstants {

    public static final String ACTIVE = "ACTIVE";
    public static final String INACTIVE = "INACTIVE";
    public static final String DELETE = "DELETE";

    public static final String PENDING = "PENDING";
    public static final String IN_PROGRESS = "IN_PROGRESS";
    public static final String DONE = "DONE";

    public static final List<String> GENERIC_STATUS = List.of(ACTIVE, INACTIVE);

    public static final List<String> TASK_STATUS = List.of(PENDING, IN_PROGRESS, DONE);
}
