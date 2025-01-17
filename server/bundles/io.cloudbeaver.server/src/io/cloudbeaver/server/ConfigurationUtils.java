/*
 * DBeaver - Universal Database Manager
 * Copyright (C) 2010-2022 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.cloudbeaver.server;

import org.jkiss.code.NotNull;
import org.jkiss.dbeaver.model.connection.DBPDriver;
import org.jkiss.utils.ArrayUtils;

public class ConfigurationUtils {
    private ConfigurationUtils() {
    }

    public static boolean isDriverEnabled(@NotNull DBPDriver driver) {
        var driverId = driver.getFullId();

        String[] disabledDrivers = CBApplication.getInstance().getAppConfiguration().getDisabledDrivers();
        if (ArrayUtils.contains(disabledDrivers, driverId)) {
            return false;
        }
        String[] enabledDrivers = CBApplication.getInstance().getAppConfiguration().getEnabledDrivers();
        if (enabledDrivers.length > 0 && !ArrayUtils.contains(enabledDrivers, driverId)) {
            return false;
        }

        return true;
    }

}
