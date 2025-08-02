import styles from './page.module.css';

export default function TermsOfServicePage() {
  return (
    <>
      <div className="fixedHeader">
        <h1 className={styles.headerTitle}>利用規約</h1>
      </div>
      <div className="scrollableArea">
        <div className={styles.container}>
          <div className={styles.section}>
            <p className={styles.preface}>この利用規約（以下、「本規約」といいます。）は、（あなたの名前またはサービス名）（以下、「当方」といいます。）がこのウェブサイト上で提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。ユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。</p>
          </div>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>第1条（適用）</h2>
            <p className={styles.text}>本規約は、ユーザーと当方との間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>第2条（利用登録）</h2>
            <p className={styles.text}>本サービスにおいては、ユーザーはGoogleアカウントを利用して利用登録を行うものとします。当方は、ユーザーが以下の事由のいずれかに該当する場合には、利用登録を承認しないことがあり、その理由については一切の開示義務を負わないものとします。</p>
            <ul className={styles.list}>
              <li>当方が定める利用規約に違反したことがある者からの申請である場合</li>
              <li>その他、当方が利用登録を相当でないと判断した場合</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>第3条（禁止事項）</h2>
            <p className={styles.text}>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
            <ul className={styles.list}>
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
              <li>当方、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
              <li>本サービスによって得られた情報を商業的に利用する行為</li>
              <li>当方のサービスの運営を妨害するおそれのある行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>不正な目的を持って本サービスを利用する行為</li>
              <li>本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
              <li>他のユーザーに成りすます行為</li>
              <li>当方が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</li>
              <li>当方のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
              <li>その他、当方が不適切と判断する行為</li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>第4条（免責事項）</h2>
            <p className={styles.text}>当方は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし、本サービスに関する当方とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>第5条（サービス内容の変更等）</h2>
            <p className={styles.text}>当方は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>第6条（利用規約の変更）</h2>
            <p className={styles.text}>当方は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。</p>
          </div>

          <div className={styles.section}>
            <p className={styles.dateText}>制定日: 2025年8月3日</p>
          </div>
        </div>
      </div>
    </>
  );
}