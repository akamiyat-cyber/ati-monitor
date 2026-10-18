# 3F4D Water Monitor (offline web app)

水位モニタリング(FP vs 3F4D+MD)のスタンドアローン・Webアプリ。ATI、NGO、SAAO などが管理する圃場(サイト)で使えます。サーバー不要、GitHub Pages に置くだけで動き、初回アクセス後はオフラインで使えます。
Stand-alone, offline-capable web app for FP vs 3F4D+MD water-level monitoring. No server needed: host it on GitHub Pages; after the first visit it works offline.

## できること / Features
- サイト名・場所・播種日・苗齢・区画・TP/b の入力 (Setup)
- 3F4D+MDアプリ(Professionalモード)と同じ規則で予定日を自動計算 (Schedule)。上書き・実績日の入力も可
- FP / 3F4D+MD の毎日の水位・灌漑・降雨の入力、TP/b の再測定の記録 (Entry)
- グラフ(水位、累積灌漑量、日減水量、節水量)とデータチェック (Dashboard)
- 閲覧専用リンク(データはURLに埋め込み。サーバーへは送信されません)、JSON/CSVの書き出し・読み込み (Share)
- 英語 / ベンガル語(ベンガル語は草稿です)

## GitHub Pages への置き方 / Deploy
1. GitHub で新しいリポジトリを作る(例: `ati-water-monitor`、Public)。
2. このフォルダの中身(`index.html`, `plotly.min.js`, `sw.js`, `manifest.webmanifest`, `icon.svg`, `water_level.png`, `manual/`)をリポジトリの直下にアップロードする(「Add file ▸ Upload files」)。
3. リポジトリの Settings ▸ Pages で、Source を「Deploy from a branch」、Branch を `main` / `(root)` にして Save。
4. 数分後、`https://<ユーザー名>.github.io/ati-water-monitor/` で開ける。スマホで開いて「ホーム画面に追加」するとアプリとして使える。初回に開いたあとは、ネットがなくても動く。

ファイルを更新したら、`sw.js` の `VERSION` を変えてください(古いキャッシュが入れ替わります)。

## 使い方 / How to use
画面の下に5つのボタンがあります: **Today / Entry / Graphs / Compare / More**。
1. **Today**: 今日の入力が済んだか、最新の水位、スケジュールの「今」と「次」。最初の準備(シートにつなぐ・Setup・最初の入力)も、ここに出ます。
2. **Entry**: Water level(毎日の水位)、Field records(施肥・農薬・分げつ数)、TP / b(再測定)に分かれています。mを入れると、すぐ下に水位が出ます。「−」「+」で0.1ずつ変えられます。パイプの写真も残せます(写真は端末だけに残り、シートには送られません)。
3. **Graphs**: 水位、累積灌漑量、日減水量、節水量のグラフとデータチェック。
4. **Compare**: シートにある他のサイトとの比較。
5. **More**: Setup、Schedule(実際の日付の入力)、Google Sheet & sharing(接続・復元・閲覧専用リンク・バックアップ)、Help、For the administrator(Excel雛形・スクリプト・設定リンク・マニュアル)、デモ。

## データの扱い / Data
- 正本は、管理者のGoogleシートです。ブラウザ(localStorage)には、送信が済むまでの控えが残ります。Share ▸ Export file で、バックアップもできます。
- 閲覧専用リンクを開いた人の端末にも、データは保存されません(「Open an editable copy」を押した場合を除く)。
- 農家名は扱いません。サイト名と緯度経度は、共有リンクを開いた人に見えます。

## 計算の定義 / Calculations
- 水位(cm) = m − TP + b(TP・bは、その日以前で一番新しい測定値)
- 灌漑量(mm) = (灌漑後の水位 − max(灌漑前の水位, 0)) × 10
- 日減水量(mm) = (前日の1日の終わりの水位 − 当日朝の水位) × 10
- 予定日: アプリの規則(移植=播種+35日、Pitan、MD、PI、冠水、3F4D 6回、出穂、収穫)。Schedule タブのSettingsで日数を変更できる。

## 3F4Dのマニュアル
- Help と、More ▸ For the administrator の「Downloads」に、リンクがあります。英語: https://doi.org/10.5281/zenodo.22932287 、ベンガル語: https://doi.org/10.5281/zenodo.23075395

## Googleシートへの自動書き込み・比較・必須項目・デモ
- Googleシートへの保存は必須です。保存(Save entry など)のたびに、共有シートのスクリプト(Google Apps Script)を通して、そのサイトのデータが自動で書き込まれます。ダッシュボードと Compare には、シートにあるデータが出ます。端末には、書き込みが済むまでの控えが残ります。
- 管理者の準備(1回だけ): More ▸ For the administrator の「Excel template」(`ATI_Monitor_Shared_TEMPLATE.xlsx`)をGoogleドライブに上げて「Googleスプレッドシートとして保存」→ 拡張機能 ▸ Apps Script に `ATI_Monitor_Sheet.gs` を貼る(アプリの More ▸ For the administrator の「Copy script」)→ デプロイ ▸ ウェブアプリ(実行: 自分、アクセス: 全員)→ 出たURLをアプリに貼る。
- More ▸ For the administrator で「Create setup link」を押すと、URL入りのリンクができます。それを利用者に配ると、利用者は開くだけでつながります。
- 新しい端末では、More ▸ Google Sheet & sharing ▸ Restore from the sheet で、サイト名を入れて、シートから戻せます。
- マニュアル(PDF)は、アプリの More ▸ For the administrator の「Downloads」からダウンロードできます(GitHubには、このフォルダごと上げてください: `manual/`、`ATI_Monitor_Shared_TEMPLATE.xlsx`、`ATI_Monitor_Sheet.gs` を含む)。
- * の項目が空だと、またはシートにつながっていないと、「Save entry」「Add」は押せません。✎ で入力を直せます。
- More ▸ Try with demo data(アドレスの末尾 `#demo`)で、例のデータを試せます。何も保存・送信されません。
- 未確認: 本物のGoogleシートでの承認・デプロイ・書き込み・読み込み(模擬では確認済み)。最初のサイトで試験してから配布してください。

## 施肥・農薬・分げつ数
- Entry タブの「Field records」に入力します。
  - 施肥: 日付、プロット(FP / 3F4D+MD / 両方)、肥料9種(Urea, TSP, DAP, Gypsum, MOP, Boron, Zinc, Magnesium, Thiovit)の量(kg)、メモ。
  - 農薬: 日付、プロット、種類(殺虫剤・殺菌剤・除草剤・その他)、薬剤名、目的、メモ。
  - 分げつ数: 日付、プロット、5株の茎数。使う値は、大きい方から2・3・4番目の平均。同じ日・同じプロットに入れ直すと上書きされます。
- Dashboard に、分げつ数のグラフと、施肥・農薬の記録表が出ます。共有リンクとJSONに含まれます。CSVは「Export records CSV」で別ファイルに出ます。

## サイト間の比較 / Comparing sites
- サイトごとに、別々のGoogleシート(管理者1人、利用者複数)を使います。
- 管理者は More ▸ For the administrator ▸ Compare with other sites で「比較用リンク」を作り、他サイトの管理者と交換します。受け取ったリンクを「Add site」で追加すると、そのサイトの利用者全員の Compare に相手サイトが出ます。比較用リンクでは読むことしかできません。
- 書き込みには、設定リンクに入っている書き込み用の鍵が必要です(スクリプトが最初に受け取った鍵を保存)。鍵をなくしたときは、シートのメニュー「3F4D Monitor ▸ Reset write key」のあと、新しい設定リンクを配ります。
- 1つのサイトに複数人が入力しても、保存のたびに記録ごとにシートと合わせる(マージ)ので、他の人の入力は消えません。同じ記録を2人が直したときは、あとの変更が残ります。

## 限界 / Limits
- 保存のたびに、そのサイトの全データがシートに書き込まれ、そのサイトの行が置き換わります(行は増え続けません)。
- 設定リンクには書き込み用の鍵が入っています。設定リンクは、そのサイトの利用者にだけ伝えてください。
- 閲覧専用リンクは、データが増えると長くなります(93日分で約2.5KB)。7,000文字を超えると警告が出ます。
