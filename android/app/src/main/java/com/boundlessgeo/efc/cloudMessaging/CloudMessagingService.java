/**
 * Copyright 2015-2017 Boundless, http://boundlessgeo.com
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
package com.boundlessgeo.efc.cloudMessaging;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import com.boundlessgeo.efc.MainActivity;
import com.boundlessgeo.efc.R;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.UUID;

import rx.Observable;
import rx.subjects.PublishSubject;

public class CloudMessagingService extends FirebaseMessagingService {

    private static final String LOG_TAG = CloudMessagingService.class.getSimpleName();

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Log.d(LOG_TAG, "onMessageReceived got notification: ");
        showNotification(remoteMessage);
    }

    private void showNotification(RemoteMessage remoteMessage) {
      RemoteMessage.Notification notification = remoteMessage.getNotification();

      Intent intent = new Intent(this, MainActivity.class);
      intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
      PendingIntent pendingIntent = PendingIntent.getActivity(this, 0 /* Request code */, intent,
              PendingIntent.FLAG_ONE_SHOT);

      Uri defaultSoundUri= RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
      NotificationCompat.Builder notificationBuilder =
              new NotificationCompat.Builder(this, UUID.randomUUID().toString())
                      .setSmallIcon(R.drawable.trigger_icon)
                      .setContentTitle(notification.getTitle())
                      .setContentText(notification.getBody())
                      .setAutoCancel(true)
                      .setSound(defaultSoundUri)
                      .setContentIntent(pendingIntent);

      NotificationManager notificationManager =
              (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

      notificationManager.notify(1, notificationBuilder.build());
    }
}
