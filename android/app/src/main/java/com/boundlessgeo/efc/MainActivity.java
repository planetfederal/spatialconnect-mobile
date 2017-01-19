/**
 * Copyright 2016 Boundless, http://boundlessgeo.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License
 */
package com.boundlessgeo.efc;

import android.app.NotificationManager;
import android.support.v7.app.NotificationCompat;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;

import com.boundlessgeo.spatialconnect.SpatialConnect;
import com.boundlessgeo.spatialconnect.mqtt.SCNotification;
import com.boundlessgeo.spatialconnect.services.SCBackendService;
import com.boundlessgeo.spatialconnect.services.SCServiceStatus;
import com.boundlessgeo.spatialconnect.services.SCServiceStatusEvent;
import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactActivity;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import io.fabric.sdk.android.Fabric;
import org.json.JSONException;
import rx.functions.Action1;
import rx.functions.Func1;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SCMobile";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Fabric.with(this, new Crashlytics());
        try {
            InputStream is = getApplicationContext().getResources().openRawResource(R.raw.config);
            // write the file to the internal storage location
            FileOutputStream fos = getApplicationContext().openFileOutput("config.scfg", Context.MODE_PRIVATE);
            byte[] data = new byte[is.available()];
            is.read(data);
            fos.write(data);
            is.close();
            fos.close();

            //list for notifications
            final SpatialConnect sc = SpatialConnect.getInstance();
            sc.serviceStarted(SCBackendService.serviceId())
            .subscribe(new Action1<SCServiceStatusEvent>() {
                @Override
                public void call(SCServiceStatusEvent scServiceStatusEvent) {
                    sc.getBackendService().getNotifications().subscribe(new Action1<SCNotification>() {
                        @Override
                        public void call(SCNotification notification) {
                            showNotification(notification);
                        }
                    });
                }
            });

        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void showNotification(SCNotification notification) {
        try {
            android.support.v4.app.NotificationCompat.Builder mBuilder =
                    new NotificationCompat.Builder(this)
                            .setSmallIcon(R.drawable.trigger_icon)
                            .setColor(0x008000) //green RGB
                            .setContentTitle(notification.toJson().get("title").toString())
                            .setContentText(notification.toJson().get("body").toString());

            int mNotificationId = 001;
            NotificationManager mNotifyMgr =
                    (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            mNotifyMgr.notify(mNotificationId, mBuilder.build());
        } catch (JSONException je) {
            Log.e("MainActivity", "something went wrong parsing notification json");
        }
    }
}
