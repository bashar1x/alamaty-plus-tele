
import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

// ============================================
// الإعدادات الأساسية
// ============================================
const BOT_TOKEN = process.env.BOT_TOKEN;
const GRADES_API_URL = process.env.GRADES_API_URL;
const API_KEY = process.env.API_KEY;


// ============================================
// البيانات الثابتة (الجامعات والكليات)
// ============================================
const UNIVERSITIES = [
  { name: 'دمشق', value: 'DAM' },
  { name: 'حلب', value: 'ALP' },
  { name: 'الفرات', value: 'FRT' },
  { name: 'حمص', value: 'HMS' },
  { name: 'اللاذقية', value: 'LTK' },
  { name: 'طرطوس', value: 'TTS' },
  { name: 'حماه', value: 'HMA' },
  { name: 'إدلب', value: 'IDL' },
];

const COLLEGES = [
  {
    name: 'كلية الآداب والعلوم الإنسانية',
    value: 'ART',
    branchs: [
      { name: 'علم الاجتماع', value: 'sociology' },
      { name: 'الجغرافيا', value: 'geography' },
      { name: 'اللغة العربية', value: 'arabic' },
      { name: 'التاريخ', value: 'history' },
      { name: 'اللغة الإنجليزية', value: 'english' },
      { name: 'اللغة الفرنسية', value: 'french' },
      { name: 'الفلسفة', value: 'philosophy' },
      { name: 'الآثار', value: 'archaeological' },
      { name: 'اللغة التركية', value: 'turkish' },
      { name: 'اللغة الفارسية', value: 'persian' },
    ],
  },
  { name: 'كلية الطب', value: 'MD' },
  {
    name: 'كلية التمريض',
    value: 'NRS',
    branchs: [
      { name: 'تمريض', value: 'nursing' },
      { name: 'القبالة', value: 'midwifery' },
    ],
  },
  { name: 'كلية الطب البيطري', value: 'VET' },
  { name: 'كلية الصيدلة', value: 'PHR' },
  { name: 'كلية طب الأسنان', value: 'DDS' },
  {
    name: 'كلية الهندسة الميكانيكية',
    value: 'MEC',
    branchs: [
      { name: 'القوى الميكانيكية', value: 'mechanical_power' },
      { name: 'التصميم والإنتاج', value: 'design_production' },
      { name: 'هندسة السيارات', value: 'automotive' },
      { name: 'الهندسة النسيجية', value: 'textile' },
    ],
  },
  {
    name: 'كلية الهندسة الكهربائية',
    value: 'ELE',
    branchs: [
      { name: 'نظم القدرة الكهربائية', value: 'electrical_power' },
      { name: 'الإلكترونيات والاتصالات', value: 'electronics_communications' },
      { name: 'الحواسب والتحكم الآلي', value: 'computers_automation' },
    ],
  },
  {
    name: 'كلية الهندسة المدنية',
    value: 'CIV',
    branchs: [
      { name: 'عام', value: 'general' },
      { name: 'الهندسة الإنشائية', value: 'structural' },
      { name: 'هندسة المواصلات', value: 'transportation' },
      { name: 'الهندسة المائية', value: 'hydraulics' },
      { name: 'الإدارة الهندسية', value: 'management' },
    ],
  },
  {
    name: 'كلية الهندسة المعمارية',
    value: 'ARC',
    branchs: [
      { name: 'هندسة العمارة', value: 'architecture' },
      { name: 'التخطيط العمراني', value: 'urban_planning' },
    ],
  },
  {
    name: 'كلية الهندسة المعلوماتية',
    value: 'IT',
    branchs: [
      { name: 'هندسة البرمجيات', value: 'software_engineering' },
      { name: 'الشبكات والنظم الحاسوبية', value: 'networks' },
      { name: 'الذكاء الاصطناعي', value: 'artificial_intelligence' },
    ],
  },
  {
    name: 'كلية الهندسة الزراعية',
    value: 'AGR',
    branchs: [
      { name: 'الإنتاج النباتي', value: 'plant_production' },
      { name: 'الإنتاج الحيواني', value: 'animal_production' },
      { name: 'علوم الأغذية', value: 'food_science' },
      { name: 'الأراضي والمياه', value: 'soil_water' },
    ],
  },
  {
    name: 'كلية الحقوق',
    value: 'LAW',
    branchs: [
      { name: 'القانون العام', value: 'public_law' },
      { name: 'القانون الخاص', value: 'private_law' },
    ],
  },
  {
    name: 'كلية التربية',
    value: 'EDU',
    branchs: [
      { name: 'معلم صف', value: 'classroom_teacher' },
      { name: 'الإرشاد النفسي', value: 'psychological_counseling' },
      { name: 'رياض الأطفال', value: 'kindergarten' },
      { name: 'مناهج وتقنيات التعليم', value: 'curriculum' },
    ],
  },
  {
    name: 'كلية الاقتصاد',
    value: 'BUS',
    branchs: [
      { name: 'المحاسبة', value: 'accounting' },
      { name: 'إدارة الأعمال', value: 'business_management' },
      { name: 'الاقتصاد', value: 'economics' },
      { name: 'العلوم المالية والمصرفية', value: 'banking_finance' },
      { name: 'الإحصاء والتأمين', value: 'statistics' },
    ],
  },
  {
    name: 'كلية العلوم',
    value: 'SCI',
    branchs: [
      { name: 'الرياضيات', value: 'mathematics' },
      { name: 'الفيزياء', value: 'physics' },
      { name: 'الكيمياء', value: 'chemistry' },
      { name: 'العلوم الجيولوجية', value: 'geology' },
      { name: 'علم الأحياء', value: 'biology' },
    ],
  },
];

// ============================================
// خرائط سريعة للبحث
// ============================================
const UNIVERSITY_MAP = new Map(UNIVERSITIES.map((u) => [u.value, u]));
const COLLEGE_MAP = new Map(COLLEGES.map((c) => [c.value, c]));

const UNIVERSITY_BY_NAME = new Map(UNIVERSITIES.map((u) => [u.name, u]));
const COLLEGE_BY_NAME = new Map(COLLEGES.map((c) => [c.name, c]));

// ============================================
// تخزين التقدم
// ============================================
const progressMap = new Map();

// ============================================
// دوال مساعدة
// ============================================
const getUniversityByValue = (value) => UNIVERSITY_MAP.get(value);
const getCollegeByValue = (value) => COLLEGE_MAP.get(value);
const getUniversityByName = (name) => UNIVERSITY_BY_NAME.get(name);
const getCollegeByName = (name) => COLLEGE_BY_NAME.get(name);

const hasBranches = (college) =>
  Boolean(college && Array.isArray(college.branchs) && college.branchs.length > 0);

const updateUserProgress = (chatId, updates) => {
  const current = progressMap.get(chatId) ?? {};
  progressMap.set(chatId, { ...current, ...updates });
};

const resetUserProgress = (chatId) => {
  progressMap.delete(chatId);
};

const getBranchName = (college, branchValue) => {
  if (!hasBranches(college) || !branchValue || branchValue === '_no_') {
    return hasBranches(college) ? '—' : 'لا يوجد';
  }
  return college.branchs.find((b) => b.value === branchValue)?.name ?? '—';
};

// ============================================
// بناء لوحات المفاتيح (Reply Keyboard)
// ============================================
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const buildMainMenuKeyboard = () => ({
  keyboard: [
    [{ text: 'البحث عن علاماتي' }],
    [{ text: 'معلوماتي' }, { text: 'إعادة التعيين' }],
    [{ text: 'طريقة الاستخدام' }],
    [{ text: 'تحميل التطبيق للحصور على المزيد من الميزات' }],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
});

const buildCancelKeyboard = () => ({
  keyboard: [[{ text: 'القائمة الرئيسية' }], [{ text: '🔙 رجوع' }]],
  resize_keyboard: true,
  one_time_keyboard: false,
});

const buildUniversitiesKeyboard = () => ({
  keyboard: [
    ...chunk(UNIVERSITIES, 2).map((row) => row.map((u) => ({ text: `${u.name}` }))),
    [{ text: '🔙 رجوع' }],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
});

const buildCollegesKeyboard = () => ({
  keyboard: [
    ...chunk(COLLEGES, 1).map((row) => row.map((c) => ({ text: `${c.name}` }))),
    [{ text: '🔙 رجوع' }],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
});

const buildBranchesKeyboard = (collegeValue) => {
  const college = getCollegeByValue(collegeValue);
  if (!hasBranches(college)) return buildMainMenuKeyboard();
  return {
    keyboard: [
      ...chunk(college.branchs, 2).map((row) => row.map((b) => ({ text: `${b.name}` }))),
      [{ text: '🔙 رجوع' }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  };
};

const buildConfirmKeyboard = () => ({
  keyboard: [
    [{ text: '✅ نعم، جلب العلامات' }],
    [{ text: '❌ إلغاء' }],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
});

// ============================================
// تهيئة البوت
// ============================================
// ============================================
// تهيئة البوت (Webhook mode)
// ============================================
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// إعدادات Webhook
const WEBHOOK_URL = process.env.WEBHOOK_URL;        // مثال: https://your-domain.com
const WEBHOOK_PATH = process.env.WEBHOOK_PATH || `/telegram-webhook/${BOT_TOKEN}`;
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET; // اختياري لكن مستحسن

if (!WEBHOOK_URL) {
  console.error('❌ يجب تعيين WEBHOOK_URL في متغيرات البيئة');
  process.exit(1);
}

const fullWebhookUrl = `${WEBHOOK_URL}${WEBHOOK_PATH}`;
// ============================================
// تنسيق رسالة العلامات (Markdown العادي)
// ============================================
const formatGradesMessage = (data) => {
  const lines = [];


  // ---------- معلومات الطالب ----------
  lines.push('👤 *معلومات الطالب*');
  if (data.name) lines.push(`   • الاسم: *${data.name}*`);
  if (data.student_id) lines.push(`   • الرقم الجامعي: \`${data.student_id}\``);
  if (data.university) lines.push(`   • الجامعة: ${data.university}`);
  if (data.college) lines.push(`   • الكلية: ${data.college}`);
  if (data.branch) lines.push(`   • الفرع: ${data.branch}`);
  lines.push('');

  // ---------- المعدلات ----------
  if (data.averages) {
    lines.push('📊 *المعدلات*');
    if (typeof data.averages.general === 'number') {
      lines.push(`   • المعدل العام: *${data.averages.general}*`);
    }
    if (Array.isArray(data.averages.years) && data.averages.years.length) {
      data.averages.years.forEach(({ year, average }) => {
        lines.push(`   • السنة ${year}: *${average}*`);
      });
    }
    lines.push('');
  }

  // ---------- المواد ----------
  if (Array.isArray(data.subjects) && data.subjects.length) {
    const byYear = new Map();
    data.subjects.forEach((s) => {
      const y = s.course_year ?? 0;
      if (!byYear.has(y)) byYear.set(y, []);
      byYear.get(y).push(s);
    });

    const sortedYears = [...byYear.keys()].sort((a, b) => a - b);

    sortedYears.forEach((year, yIdx) => {
      const subjects = byYear.get(year);
      const passedCount = subjects.filter((s) => s.passed).length;
      const failedCount = subjects.length - passedCount;

      lines.push(`📆 *السنة ${year}*`);
      lines.push(
        `   📖 المواد: *${subjects.length}* ┆ ✓ ناجح: *${passedCount}* ┆ ✗ راسب: *${failedCount}*`
      );
      lines.push('');

      subjects.forEach((s) => {
        const icon = s.passed ? '✓' : '✗';
        lines.push(`   *${s.grade ?? '—'}*  ${icon} ${s.subject}`);
      });

      if (yIdx < sortedYears.length - 1) lines.push('');
    });
  } else {
    lines.push('⚠️ _لا توجد مواد مسجلة._');
  }

  return lines.join('\n');
};

// ============================================
// جلب العلامات من الخادم
// ============================================
const fetchAndSendGrades = async (chatId) => {

  const ckeckSubscription = await chatMember(chatId);
  if (ckeckSubscription) return;

  const p = progressMap.get(chatId);
  const college = getCollegeByValue(p.college);
  const branchValue = hasBranches(college) ? p.branch ?? '_no_' : '_no_';

  const payload = {
    universityId: p.university,
    college_id: p.college,
    branch_id: branchValue,
    student_id: p.studentId,
  };

  const loadingMsg = await bot.sendMessage(chatId, '⏳ جارٍ جلب علاماتك...', {
    parse_mode: 'Markdown',
  });

  try {
    const res = await fetch(GRADES_API_URL + '/api/tele/v1/get-grades-tele', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(data)
    if (data.type !== 'LS') {
      resetUserProgress(chatId);
      return await bot.sendMessage(chatId, data.message || '❌ حدث خطأ أثناء جلب العلامات.',
        { parse_mode: 'Markdown', reply_markup: buildCancelKeyboard() }
      );
    }


    if (!data?.students.subjects || !Array.isArray(data.students.subjects)) {
      throw new Error('لم يتم العثور على بيانات علامات صحيحة');
    }

    if (data.students?.verify) {
      resetUserProgress(chatId);
      return await bot.sendMessage(chatId, "هذا الحساب مقفل، لا يمكنك الوصول إلى بيانات العلامات.", {
        parse_mode: 'Markdown',
        reply_markup: buildMainMenuKeyboard(),
      });
    }

    await bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => { });
    await bot.sendMessage(chatId, formatGradesMessage(data.students), {
      parse_mode: 'Markdown',
      reply_markup: buildMainMenuKeyboard(),
    });

  } catch (err) {
    console.error('❌ خطأ في جلب العلامات:', err.message);
    resetUserProgress(chatId);
    await bot.sendMessage(
      chatId,
      `❌ *فشل جلب العلامات*\n\nيمكنك المحاولة مجدداً أو اختيار "🔄 إعادة التعيين".`,
      { parse_mode: 'Markdown', reply_markup: buildMainMenuKeyboard() }
    );
  }
};

// ============================================
// منطق تدفق جلب العلامات
// ============================================
const handleGradesRequest = async (chatId) => {
  const p = progressMap.get(chatId);

  if (!p?.university) {
    updateUserProgress(chatId, { step: 'awaiting_university' });
    return bot.sendMessage(chatId, '🏛️ *الرجاء اختيار الجامعة:*', {
      parse_mode: 'Markdown',
      reply_markup: buildUniversitiesKeyboard(),
    });
  }

  if (!p.college) {
    updateUserProgress(chatId, { step: 'awaiting_college' });
    return bot.sendMessage(chatId, '🎓 *الرجاء اختيار الكلية:*', {
      parse_mode: 'Markdown',
      reply_markup: buildCollegesKeyboard(),
    });
  }

  const college = getCollegeByValue(p.college);
  if (hasBranches(college) && !p.branch) {
    updateUserProgress(chatId, { step: 'awaiting_branch' });
    return bot.sendMessage(chatId, '📚 *الرجاء اختيار الفرع:*', {
      parse_mode: 'Markdown',
      reply_markup: buildBranchesKeyboard(p.college),
    });
  }

  if (!p.studentId) {
    updateUserProgress(chatId, { step: 'awaiting_student_id' });
    return bot.sendMessage(
      chatId,
      '🆔 *الرجاء إدخال رقمك الجامعي* (أرقام فقط):',
      { parse_mode: 'Markdown', reply_markup: buildCancelKeyboard() }
    );
  }

  await fetchAndSendGrades(chatId);
};

// ============================================
// الأوامر
// ============================================
bot.onText(/^\/start$/, async (msg) => {
  const chatId = msg.chat.id;
  resetUserProgress(chatId);

  const welcome =
    `👋 *أهلاً بك ${msg.from.first_name ?? ''}!*\n\n` +
    `هذا البوت يساعدك على جلب علاماتك الجامعية بسهولة.\n\n` +
    `*خطوات الاستخدام:*\n` +
    `1️⃣ اضغط "📊  البحث عن العلامات"\n` +
    `2️⃣ اختر الجامعة\n` +
    `3️⃣ اختر الكلية\n` +
    `4️⃣ اختر الفرع (إن وُجد)\n` +
    `5️⃣ أدخل رقمك الجامعي`

  await bot.sendMessage(chatId, welcome, {
    parse_mode: 'Markdown',
    reply_markup: buildMainMenuKeyboard(),
  });
});


// ============================================
// معالجة الرسائل النصية (Reply Keyboard + الرقم الجامعي)
// ============================================
bot.on('message', async (msg) => {
  if (!msg.text) return;
  const text = msg.text.trim();
  if (text.startsWith('/')) return;

  const chatId = msg.chat.id;
  const p = progressMap.get(chatId);

  // ---------- أزرار عامة ----------
  if (text === 'القائمة الرئيسية') {
    return bot.sendMessage(chatId, '🏠 *القائمة الرئيسية*', {
      parse_mode: 'Markdown',
      reply_markup: buildMainMenuKeyboard(),
    });
  }

  if (text === 'البحث عن علاماتي') {
    return handleGradesRequest(chatId);
  }

  if (text === 'إعادة التعيين') {
    resetUserProgress(chatId);
    return bot.sendMessage(chatId, '🔄 *تم إعادة تعيين بياناتك.*', {
      parse_mode: 'Markdown',
      reply_markup: buildCancelKeyboard(),
    });
  }

  if (text === 'معلوماتي') {
    if (!p) {
      return bot.sendMessage(chatId, '📭 لا توجد بيانات محفوظة.', {
        parse_mode: 'Markdown',
        reply_markup: buildMainMenuKeyboard(),
      });
    }
    const uni = p.university ? getUniversityByValue(p.university) : null;
    const col = p.college ? getCollegeByValue(p.college) : null;
    return bot.sendMessage(
      chatId,
      `📋 *بياناتك:*\n\n🏛️ ${uni?.name ?? '—'}\n🎓 ${col?.name ?? '—'}\n📚 ${getBranchName(
        col,
        p.branch
      )}\n🆔 \`${p.studentId ?? '—'}\``,
      { parse_mode: 'Markdown', reply_markup: buildMainMenuKeyboard() }
    );
  }

  if (text === 'طريقة الاستخدام') {
    return bot.sendMessage(
      chatId,
      `خطوات استخدام البوت:\n\n` +
      `1️⃣ اضغط على "البحث عن علاماتي"\n` +
      `2️⃣ اختر الجامعة\n` +
      `3️⃣ اختر الكلية\n` +
      `4️⃣ اختر الفرع (إن وُجد)\n` +
      `5️⃣ أدخل رقمك الجامعي`, +
      `\n\n*ملاحظة:* يمكنك استخدام "إعادة التعيين" لإعادة إدخال بياناتك من البداية.`,
      { reply_markup: buildMainMenuKeyboard() }
    );
  }

  if (text === 'تحميل التطبيق للحصور على المزيد من الميزات') {
    return bot.sendMessage(
      chatId,
      `استخدام التطبيق يوفر العديد من الميزات

      كشف علامات
      مشاركات كرت مميز
      جدول امتحانات 
      جدول الدوام
      احصائيات تفصيلة
      أضاف مواد مفقودة
      وغيرها من هذا التفاصيل 

      استخدام الرابط التالي لتحميل التطبيق

      https://alamaty-plus.expo.app/download`,
    );
  }

  if (text === '🔙 رجوع') {
    if (!p) {
      return bot.sendMessage(chatId, '🏠 القائمة الرئيسية', {
        reply_markup: buildMainMenuKeyboard(),
      });
    }
    if (p.step === 'awaiting_college' || p.step === 'awaiting_branch') {
      updateUserProgress(chatId, {
        college: undefined,
        branch: undefined,
        step: 'awaiting_university',
      });
      return bot.sendMessage(chatId, '🏛️ *اختر الجامعة:*', {
        parse_mode: 'Markdown',
        reply_markup: buildUniversitiesKeyboard(),
      });
    }
    if (p.step === 'awaiting_student_id') {
      const col = getCollegeByValue(p.college);
      if (hasBranches(col)) {
        updateUserProgress(chatId, { branch: undefined, step: 'awaiting_branch' });
        return bot.sendMessage(chatId, '📚 *اختر الفرع:*', {
          parse_mode: 'Markdown',
          reply_markup: buildBranchesKeyboard(p.college),
        });
      }
      updateUserProgress(chatId, { college: undefined, step: 'awaiting_university' });
      return bot.sendMessage(chatId, '🏛️ *اختر الجامعة:*', {
        parse_mode: 'Markdown',
        reply_markup: buildUniversitiesKeyboard(),
      });
    }
    return bot.sendMessage(chatId, '🏠 القائمة الرئيسية', {
      reply_markup: buildMainMenuKeyboard(),
    });
  }

  // ---------- اختيار جامعة ----------
  if (p?.step === 'awaiting_university') {
    const name = text.replace('🏛️ ', '').trim();
    const uni = getUniversityByName(name);
    if (!uni) return;
    updateUserProgress(chatId, {
      university: uni.value,
      college: undefined,
      branch: undefined,
      studentId: undefined,
      step: 'awaiting_college',
    });
    return bot.sendMessage(
      chatId,
      `🏛️ اخترت: *${uni.name}*\n\nالآن اختر الكلية:`,
      { parse_mode: 'Markdown', reply_markup: buildCollegesKeyboard() }
    );
  }

  // ---------- اختيار كلية ----------
  if (p?.step === 'awaiting_college') {
    const name = text.replace('🎓 ', '').trim();
    const college = getCollegeByName(name);
    if (!college) return;

    if (hasBranches(college)) {
      updateUserProgress(chatId, {
        college: college.value,
        branch: undefined,
        studentId: undefined,
        step: 'awaiting_branch',
      });
      return bot.sendMessage(
        chatId,
        `🎓 اخترت: *${college.name}*\n\nهذه الكلية تحتوي على فروع. اختر الفرع:`,
        { parse_mode: 'Markdown', reply_markup: buildBranchesKeyboard(college.value) }
      );
    }

    updateUserProgress(chatId, {
      college: college.value,
      branch: '_no_',
      step: 'awaiting_student_id',
    });
    return bot.sendMessage(
      chatId,
      `🎓 اخترت: *${college.name}*\n\nهذه الكلية لا تحتوي على فروع.\n\ الآن ارسل لي رقمك الجامعي (أرقام فقط):`,
      { parse_mode: 'Markdown', reply_markup: buildCancelKeyboard() }
    );
  }

  // ---------- اختيار فرع ----------
  if (p?.step === 'awaiting_branch') {
    const name = text.replace('📚 ', '').trim();
    const college = getCollegeByValue(p.college);
    const branch = college?.branchs?.find((b) => b.name === name);
    if (!branch) return;

    updateUserProgress(chatId, {
      branch: branch.value,
      step: 'awaiting_student_id',
    });
    return bot.sendMessage(
      chatId,
      `📚 اخترت الفرع: *${branch.name}*\n\nالآن ارسل لي رقمك الجامعي ✏️ (أرقام فقط):`,
      { parse_mode: 'Markdown', reply_markup: buildCancelKeyboard() }
    );
  }

  // ---------- تأكيد ----------
  if (p?.step === 'confirming') {
    if (text === '✅ نعم، جلب العلامات') {
      return fetchAndSendGrades(chatId);
    }
    if (text === '❌ إلغاء') {
      resetUserProgress(chatId);
      return bot.sendMessage(chatId, '❌ *تم الإلغاء.* ابدأ من جديد.', {
        parse_mode: 'Markdown',
        reply_markup: buildMainMenuKeyboard(),
      });
    }
    return;
  }

  // ---------- إدخال الرقم الجامعي ----------
  if (p?.step === 'awaiting_student_id') {
    if (!/^\d{3,20}$/.test(text)) {
      return bot.sendMessage(
        chatId,
        '⚠️ *الرقم الجامعي غير صالح.* \nيرجى إدخال أرقام فقط (3 خانات على الأقل).',
        { parse_mode: 'Markdown', reply_markup: buildCancelKeyboard() }
      );
    }

    updateUserProgress(chatId, { studentId: text, step: 'confirming' });

    const uni = getUniversityByValue(p.university);
    const col = getCollegeByValue(p.college);

    const summary =
      `📋 *تأكيد البيانات:*\n\n` +
      `🏛️ الجامعة: ${uni?.name ?? '—'}\n` +
      `🎓 الكلية: ${col?.name ?? '—'}\n` +
      `📚 الفرع: ${getBranchName(col, p.branch)}\n` +
      `🆔 الرقم الجامعي: \`${text}\`\n\n` +
      `هل تريد جلب العلامات الآن؟`;

    return bot.sendMessage(chatId, summary, {
      parse_mode: 'Markdown',
      reply_markup: buildConfirmKeyboard(),
    });
  }
});



export const chatMember = async (id) => {
    try {
        const result = await bot.getChatMember('@alamatyplus_channel', id);

        switch (result.status) {
            case 'left':
                await bot.sendMessage(id, 'عذرا يجب عليك اولا الأشتراك بالقناة', {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "اشترك من هنا", url: "https://t.me/alamatyplus_channel" }]
                        ]
                    }
                });
                return true;

            case 'kicked':
                await bot.sendMessage(id, 'انت محظور من الأستخدام, راجع المنشئ لمساعدتك', {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Bashar", url: "https://t.me/bashar1_x" }],
                        ]
                    }
                });
                return true;

            default:
                return false;
        }
    } catch (err) {
        console.log(err);
    }
};


// ============================================
// معالجة الأخطاء العامة
// ============================================
// ============================================
// خادم HTTP لاستقبال Webhook
// ============================================
import http from 'http';

const server = http.createServer(async (req, res) => {
  // فحص المسار
  if (req.method !== 'POST' || req.url !== WEBHOOK_PATH) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not Found');
  }

  // التحقق من الـ secret token (إن وُجد)
  if (WEBHOOK_SECRET) {
    const token = req.headers['x-telegram-bot-api-secret-token'];
    if (token !== WEBHOOK_SECRET) {
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      return res.end('Unauthorized');
    }
  }

  // قراءة جسم الطلب
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const update = JSON.parse(body);
      await bot.processUpdate(update);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('OK');
    } catch (err) {
      console.error('❌ خطأ في معالجة التحديث:', err.message);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error');
    }
  });
});

// ============================================
// تشغيل الخادم وضبط Webhook
// ============================================
server.listen(PORT, async () => {
  console.log(`🌐 الخادم يعمل على المنفذ ${PORT}`);

  try {
    // حذف أي webhook قديم أولاً
    await bot.deleteWebHook();
    // تسجيل webhook الجديد
    await bot.setWebHook(fullWebhookUrl, {
      secret_token: WEBHOOK_SECRET,
      max_connections: 40,
      allowed_updates: ['message', 'callback_query'],
    });
    console.log(`✅ تم تسجيل Webhook على: ${fullWebhookUrl}`);
    console.log('🤖 البوت يعمل الآن بوضع Webhook...');
  } catch (err) {
    console.error('❌ فشل تسجيل Webhook:', err.message);
    // process.exit(1);
  }
});

// إغلاق نظيف
process.on('SIGINT', async () => {
  console.log('\n🛑 إيقاف البوت...');
  server.close();
  process.exit(0);
});
console.log('🤖 البوت يعمل الآن بوضع Polling...');