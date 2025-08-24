// firebase-messaging-sw.js - إصدار محسن ومُصلح
console.log('[SW] 🚀 Starting Service Worker initialization...');

try {
  importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');
  console.log('[SW] ✅ Firebase scripts imported successfully');
} catch (error) {
  console.error('[SW] ❌ Failed to import Firebase scripts:', error);
  throw error;
}

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCXX_kt4-3J_ocNKYAegNTar4Bd9OIgA2k",
  authDomain: "eslam-website.firebaseapp.com",
  projectId: "eslam-website",
  storageBucket: "eslam-website.firebasestorage.app",
  messagingSenderId: "626111073932",
  appId: "1:626111073932:web:f7137bc90e139e822675a9",
  measurementId: "G-3DD9VGDC46"
};

let messaging;

try {
  // تهيئة Firebase
  firebase.initializeApp(firebaseConfig);
  messaging = firebase.messaging();
  console.log('[SW] ✅ Firebase initialized successfully');
} catch (error) {
  console.error('[SW] ❌ Failed to initialize Firebase:', error);
  throw error;
}

// دالة مساعدة لاستخراج بيانات الإشعار
function extractNotificationData(payload) {
  const data = {
    title: payload?.notification?.title || 
           payload?.data?.title || 
           'Civil Files',
    
    body: payload?.notification?.body || 
          payload?.data?.dailyMessage || 
          payload?.data?.body ||
          'لديك إشعار جديد',
    
    icon: payload?.notification?.icon || 
          'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
    
    image: payload?.notification?.image || null,
    
    url: payload?.webpush?.fcm_options?.link || 
         payload?.data?.url || 
         'https://eslamwael73.github.io/CIVIL_links-/',
    
    rawData: payload?.data || {}
  };
  
  console.log('[SW] 📊 Extracted notification data:', data);
  return data;
}

// دالة عرض الإشعار المحسنة
async function displayNotification(data, source = 'unknown') {
  try {
    const notificationOptions = {
      body: data.body,
      icon: data.icon,
      badge: data.icon,
      image: data.image,
      tag: `civil-files-${source}-${Date.now()}`,
      requireInteraction: true,
      silent: false,
      vibrate: [200, 100, 200, 100, 200],
      timestamp: Date.now(),
      renotify: true,
      actions: [
        {
          action: 'open_site',
          title: 'فتح الموقع',
          icon: data.icon
        },
        {
          action: 'remind_later',
          title: 'تذكيرني لاحقًا',
          icon: data.icon
        },
        {
          action: 'close',
          title: 'إغلاق',
          icon: data.icon
        }
      ],
      data: {
        url: data.url,
        title: data.title,
        body: data.body,
        timestamp: Date.now(),
        source: source,
        ...data.rawData
      }
    };

    await self.registration.showNotification(data.title, notificationOptions);
    console.log(`[SW] ✅ ${source} notification displayed:`, data.title);
    return true;
  } catch (error) {
    console.error(`[SW] ❌ Error displaying ${source} notification:`, error);
    
    // محاولة إشعار بسيط كـ fallback
    try {
      await self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        tag: `civil-files-simple-${Date.now()}`,
        data: { url: data.url }
      });
      console.log('[SW] ✅ Fallback notification displayed');
      return true;
    } catch (fallbackError) {
      console.error('[SW] ❌ Fallback notification also failed:', fallbackError);
      return false;
    }
  }
}

// معالجة الإشعارات في الخلفية - النسخة المُصلحة
if (messaging) {
  messaging.onBackgroundMessage(async function(payload) {
    console.log('[SW] 📩 Background message received:', JSON.stringify(payload, null, 2));
    
    if (!payload) {
      console.error('[SW] ❌ Payload is null or undefined');
      return;
    }

    try {
      const notificationData = extractNotificationData(payload);
      const success = await displayNotification(notificationData, 'background');
      
      if (success) {
        console.log('[SW] ✅ Background notification processed successfully');
      } else {
        console.error('[SW] ❌ Background notification failed to display');
      }
    } catch (error) {
      console.error('[SW] ❌ Error in background message handler:', error);
      
      // إشعار طوارئ
      try {
        await self.registration.showNotification('Civil Files', {
          body: 'لديك رسالة جديدة',
          icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
          tag: 'civil-files-emergency',
          data: { url: 'https://eslamwael73.github.io/CIVIL_links-/' }
        });
        console.log('[SW] ⚠️ Emergency notification displayed');
      } catch (emergencyError) {
        console.error('[SW] ❌ Emergency notification also failed:', emergencyError);
      }
    }
  });
} else {
  console.error('[SW] ❌ Messaging object not available');
}

// معالج النقر على الإشعار - محسن
self.addEventListener('notificationclick', function(event) {
  console.log('[SW] 🖱️ Notification clicked. Action:', event.action, 'Tag:', event.notification.tag);
  
  // إغلاق الإشعار
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  const urlToOpen = notificationData.url || 'https://eslamwael73.github.io/CIVIL_links-/';
  
  // معالجة الإجراءات المختلفة
  if (event.action === 'close') {
    console.log('[SW] ❌ User dismissed notification');
    return;
  } 
  else if (event.action === 'remind_later') {
    console.log('[SW] ⏰ Setting reminder for 30 minutes');
    
    // تأجيل التذكير لـ 30 دقيقة
    setTimeout(async () => {
      try {
        await self.registration.showNotification('تذكير - Civil Files', {
          body: notificationData.body || 'لا تنس زيارة الموقع!',
          icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
          badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
          tag: 'civil-files-reminder-' + Date.now(),
          requireInteraction: true,
          data: notificationData
        });
        console.log('[SW] ✅ Reminder notification shown');
      } catch (err) {
        console.error('[SW] ❌ Error showing reminder:', err);
      }
    }, 30 * 60 * 1000); // 30 دقيقة
    return;
  }
  
  // فتح الموقع (الإجراء الافتراضي)
  event.waitUntil(
    (async () => {
      try {
        console.log('[SW] 🔍 Looking for existing windows...');
        
        const clientList = await clients.matchAll({ 
          type: 'window', 
          includeUncontrolled: true 
        });
        
        console.log('[SW] 📱 Found', clientList.length, 'open windows');
        
        // البحث عن نافذة موجودة
        for (const client of clientList) {
          if (client.url.includes('eslamwael73.github.io/CIVIL_links-/') && 'focus' in client) {
            console.log('[SW] 🔄 Focusing existing window:', client.url);
            
            // إرسال رسالة للنافذة الموجودة
            client.postMessage({
              type: 'NOTIFICATION_CLICKED',
              data: {
                title: notificationData.title,
                body: notificationData.body,
                timestamp: notificationData.timestamp,
                source: 'service_worker'
              }
            });
            
            return client.focus();
          }
        }
        
        // فتح نافذة جديدة إذا لم توجد
        if (clients.openWindow) {
          console.log('[SW] 🆕 Opening new window:', urlToOpen);
          return clients.openWindow(urlToOpen);
        } else {
          console.error('[SW] ❌ Cannot open new window - clients.openWindow not available');
        }
      } catch (error) {
        console.error('[SW] ❌ Error handling notification click:', error);
      }
    })()
  );
});

// معالج إغلاق الإشعار
self.addEventListener('notificationclose', function(event) {
  console.log('[SW] 🔕 Notification closed by user:', event.notification.tag);
  
  // يمكن إضافة تتبع إحصائيات هنا
  const closeData = {
    tag: event.notification.tag,
    title: event.notification.title,
    closedAt: new Date().toISOString()
  };
  
  console.log('[SW] 📊 Notification close stats:', closeData);
});

// معالج تثبيت Service Worker
self.addEventListener('install', function(event) {
  console.log('[SW] 📦 Service Worker installing...');
  
  event.waitUntil(
    (async () => {
      try {
        // تخطي انتظار التفعيل
        await self.skipWaiting();
        console.log('[SW] ⚡ Service Worker installation completed');
      } catch (error) {
        console.error('[SW] ❌ Error during installation:', error);
      }
    })()
  );
});

// معالج تفعيل Service Worker
self.addEventListener('activate', function(event) {
  console.log('[SW] 🚀 Service Worker activating...');
  
  event.waitUntil(
    (async () => {
      try {
        // التحكم في جميع العملاء فوراً
        await clients.claim();
        console.log('[SW] ✅ Service Worker activated and claimed all clients');
        
        // إشعار اختباري عند التفعيل (اختياري)
        if (Notification && Notification.permission === 'granted') {
          setTimeout(async () => {
            try {
              await self.registration.showNotification('Civil Files - تم التحديث', {
                body: 'نظام الإشعارات جاهز للعمل! ✅',
                icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
                badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
                tag: 'civil-files-ready',
                requireInteraction: false,
                silent: true,
                data: { url: 'https://eslamwael73.github.io/CIVIL_links-/' }
              });
              console.log('[SW] ✅ Ready notification displayed');
            } catch (err) {
              console.log('[SW] ⚠️ Could not show ready notification:', err.message);
            }
          }, 1000);
        }
      } catch (error) {
        console.error('[SW] ❌ Error during activation:', error);
      }
    })()
  );
});

// معالج الرسائل من الصفحة الرئيسية - مُصلح
self.addEventListener('message', function(event) {
  console.log('[SW] 📨 Message received from main page:', event.data);
  
  try {
    const messageType = event.data?.type;
    
    switch (messageType) {
      case 'CHECK_BACKGROUND_NOTIFICATIONS':
        console.log('[SW] ✅ Background notifications check requested');
        const topic = event.data?.data?.topic || 'all_users';
        
        // إرسال رد مؤكد للصفحة الرئيسية
        const response = {
          type: 'BACKGROUND_NOTIFICATION_STATUS',
          status: 'active',
          message: `Background notifications ready for topic: ${topic}`,
          timestamp: new Date().toISOString(),
          swVersion: '2.0'
        };
        
        // طريقتان للرد حسب نوع الرسالة
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage(response);
        } else if (event.source) {
          event.source.postMessage(response);
        }
        
        console.log('[SW] 📤 Response sent to main page:', response);
        break;

      case 'SKIP_WAITING':
        console.log('[SW] ⚡ Skipping waiting phase...');
        self.skipWaiting();
        break;

      case 'TEST_NOTIFICATION':
        console.log('[SW] 🧪 Test notification requested');
        displayNotification({
          title: 'اختبار النظام',
          body: 'إشعارات الخلفية تعمل بشكل مثالي! ✅',
          icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
          url: 'https://eslamwael73.github.io/CIVIL_links-/',
          rawData: {}
        }, 'test');
        break;

      default:
        console.log('[SW] ℹ️ Unknown message type:', messageType);
    }
  } catch (error) {
    console.error('[SW] ❌ Error handling message:', error);
  }
});

// معالج الأخطاء العام
self.addEventListener('error', function(event) {
  console.error('[SW] ❌ Service Worker error:', event.error);
});

// معالج الـ Promise rejections غير المعالجة
self.addEventListener('unhandledrejection', function(event) {
  console.error('[SW] ❌ Unhandled promise rejection in SW:', event.reason);
  event.preventDefault(); // منع ظهور الخطأ في console
});

// دالة التحقق الدوري من حالة النظام
function startPeriodicCheck() {
  setInterval(() => {
    console.log('[SW] 🔄 Periodic check: Service Worker is alive');
    console.log('[SW] 📊 Registration state:', {
      scope: self.registration?.scope,
      active: !!self.registration?.active,
      installing: !!self.registration?.installing,
      waiting: !!self.registration?.waiting
    });
  }, 2 * 60 * 1000); // كل دقيقتين
}

// دالة اختبار دورية للإشعارات (كل ساعة - اختياري)
function setupHourlyTest() {
  setInterval(async () => {
    try {
      console.log('[SW] 🕐 Hourly notification test...');
      
      // اختبار بسيط للتأكد من عمل النظام
      const testData = {
        title: 'Civil Files - اختبار دوري',
        body: 'نظام الإشعارات يعمل بشكل طبيعي',
        icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
        url: 'https://eslamwael73.github.io/CIVIL_links-/',
        rawData: { testType: 'hourly', timestamp: Date.now() }
      };
      
      // عرض الاختبار فقط إذا لم تكن هناك نوافذ مفتوحة
      const clients = await self.clients.matchAll({ type: 'window' });
      if (clients.length === 0) {
        await displayNotification(testData, 'hourly-test');
      }
    } catch (error) {
      console.error('[SW] ❌ Hourly test failed:', error);
    }
  }, 60 * 60 * 1000); // كل ساعة
}

// تشغيل الفحوصات الدورية
startPeriodicCheck();
// setupHourlyTest(); // علق هذا السطر إذا لم تريد اختبار كل ساعة

console.log('[SW] ✅ Service Worker setup complete and ready for background notifications');

// إرسال إشارة للصفحة الرئيسية أن SW جاهز
self.addEventListener('activate', function(event) {
  event.waitUntil(
    (async () => {
      await clients.claim();
      
      // إشعار جميع العملاء أن SW جاهز
      const allClients = await clients.matchAll();
      allClients.forEach(client => {
        client.postMessage({
          type: 'SW_ACTIVATED',
          message: 'Service Worker is ready for notifications',
          timestamp: new Date().toISOString()
        });
      });
      
      console.log('[SW] 📡 Notified all clients that SW is ready');
    })()
  );
});