import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '利用規約 | KUSOGET',
  description: 'KUSOGETの利用規約。サービスをご利用いただく際の条件を定めています。',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">利用規約</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">第1条（適用）</h2>
            <p className="text-muted-foreground leading-relaxed">
              本利用規約（以下「本規約」といいます。）は、KUSOGET（以下「当サイト」といいます。）の利用条件を定めるものです。
              登録ユーザーの皆さま（以下「ユーザー」といいます。）には、本規約に従って、当サイトをご利用いただきます。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">第2条（利用登録）</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サイトの利用を希望する方は、本規約に同意の上、当サイトの定める方法によって利用登録を申請し、当サイトがこれを承認することによって、利用登録が完了するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">第3条（ユーザーIDおよびパスワードの管理）</h2>
            <p className="text-muted-foreground leading-relaxed">
              ユーザーは、自己の責任において、当サイトのユーザーIDおよびパスワードを適切に管理するものとします。
              ユーザーIDまたはパスワードが第三者に使用されたことによって生じた損害は、当サイトに故意または重大な過失がある場合を除き、当サイトは一切の責任を負わないものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">第4条（禁止事項）</h2>
            <p className="text-muted-foreground leading-relaxed">
              ユーザーは、当サイトの利用にあたり、以下の行為をしてはなりません。
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当サイトの内容等、当サイトに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
              <li>当サイト、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
              <li>当サイトによって得られた情報を商業的に利用する行為</li>
              <li>当サイトの運営を妨害するおそれのある行為</li>
              <li>不正アクセス、ハッキング、その他これに類する行為</li>
              <li>その他、当サイトが不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">第5条（投稿コンテンツ）</h2>
            <p className="text-muted-foreground leading-relaxed">
              ユーザーが当サイトに投稿したコンテンツ（ゲームURL、説明文、画像等を含みますが、これらに限りません。）について、ユーザーは、当サイトに対し、世界的、非独占的、無償、サブライセンス可能かつ譲渡可能な使用、複製、配布、派生著作物の作成、表示および実行に関するライセンスを付与します。
              また、ユーザーは、当サイトに対し、著作者人格権を行使しないことに同意するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">第6条（コンテンツの削除）</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サイトは、ユーザーが投稿したコンテンツが、本規約に違反していると判断した場合、あらかじめ通知することなく、当該コンテンツを削除することができるものとします。
              また、当サイトは、ユーザーが投稿したコンテンツについて、削除の必要があると判断した場合、あらかじめ通知することなく、当該コンテンツを削除することができるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">第7条（保証の否認および免責）</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サイトは、当サイトに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
              当サイトに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">第8条（サービス内容の変更等）</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サイトは、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">第9条（利用規約の変更）</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サイトは以下の場合には、ユーザーの個別の同意を待たず、本規約を変更することができるものとします。
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>本規約の変更がユーザーの一般の利益に適合するとき。</li>
              <li>本規約の変更が当サイトのサービス提供の実施に必要な範囲の変更であるとき。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">第10条（個人情報の取扱い）</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サイトは、当サイトのプライバシーポリシーに従って、ユーザーの個人情報を取扱うものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">第11条（通知または連絡）</h2>
            <p className="text-muted-foreground leading-relaxed">
              ユーザーと当サイトとの間の通知または連絡は、当サイトの定める方法によって行うものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">第12条（権利義務の譲渡の禁止）</h2>
            <p className="text-muted-foreground leading-relaxed">
              ユーザーは、当サイトの書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">第13条（準拠法・裁判管轄）</h2>
            <p className="text-muted-foreground leading-relaxed">
              本規約の解釈にあたっては、日本法を準拠法とします。
              本サービスに関して紛争が生じた場合には、当サイトの本店所在地を管轄する裁判所を専属的合意管轄とします。
            </p>
          </section>

          <section className="pt-8">
            <p className="text-sm text-muted-foreground">
              制定日：2026年1月28日
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <Link 
            href="/"
            className="text-primary hover:underline"
          >
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
