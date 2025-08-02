import styles from './page.module.css';

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="fixedHeader">
        <h1 className={styles.headerTitle}>プライバシーポリシー</h1>
      </div>
      <div className="scrollableArea">
        <div className={styles.container}>
          <div className={styles.section}>
            <p className={styles.preface}>PageShelf（以下、「当サービス」といいます。）は、本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。</p>
          </div>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>第1条（個人情報）</h2>
            <p className={styles.text}>「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容姿、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>第2条（個人情報の収集方法）</h2>
            <p className={styles.text}>本サービスでは、ユーザーが利用登録をする際にGoogleアカウントの情報を利用します。Googleアカウントからは、メールアドレス、氏名、プロフィール画像などの情報を取得する場合があります。</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>第3条（個人情報を収集・利用する目的）</h2>
            <p className={styles.text}>当サービスが個人情報を収集・利用する目的は、以下のとおりです。</p>
            <ul className={styles.list}>
              <li>本サービスの提供・運営のため</li>
              <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
              <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
              <li>上記の利用目的に付随する目的</li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>第4条（利用目的の変更）</h2>
            <p className={styles.text}>当サービスは、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。利用目的の変更を行った場合には、変更後の目的について、当サービス所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>第5条（個人情報の第三者提供）</h2>
            <p className={styles.text}>当サービスは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。</p>
            <ul className={styles.list}>
                <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>第7条（プライバシーポリシーの変更）</h2>
            <p className={styles.text}>本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。当サービスが別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>第8条（お問い合わせ窓口）</h2>
            <p className={styles.text}>本ポリシーに関するお問い合わせは、お問い合わせフォームよりお願いいたします。</p>
            <p className={styles.dateText}>制定日: 2025年8月3日</p>
          </div>
        </div>
      </div>
    </>
  );
}