const badwordsFiltering = (input: string) => {
  input = input.replace(
    /개자지|개보지|애비자지|애미보지|자지|잠지|보지|섹스|공알|좆|좇|좃|젖|빨통|딸딸이|딸따리|빠구리|빠굴이|빠굴|빠순이|빠수니|사까시|불알|부랄|번섹|번쌕|번쎅|떡치기|후장|섹스|색스|쎅스|쌕스|쉑스|섹쓰|색쓰|쎅쓰|쌕쓰|쉑쓰|죷|죳|좆나|좇나|존나|죤나|욧나|쟈지|죠또|죵나|자쥣|죠빠|쫓까|죡쳐|보쥐|쟘쥐|꼬추|꼬츄|곧휴|쟘지|ㅈㅏㅈㅣ|ㅈㅏ지|자쥐|잠쥐|쟘쥐|유두|유방|폰섹|ㅃㅏ구리|ㅃr굴|고츄|붕알|폰색|죠까|sex|porno|귀두|뽕알|보댕이|보짓|잠짓|Bozi|발기|콘돔|슴가|암캐|처녀뚫기|성교|성폭행|로리타|입싸|질싸|얼싸|갸슴|슴만튀|스섹|씹질|십질|오랄|잦빨|보빨|고추털|짬지|섹머|질내사정|뵤지|뒤치기|애무|질액|애액|질분비|성노예|육노예|똥꼬|소음순|뒷구녕|섹파|고환|음경|겁간|G스팟|즐딸|왕고추|잦이|성매매|돌림빵|오르가즘|펠라치|석l스|곶휴|생삽입|씨댕|씨뎅|시댕|시뎅|씨방새|씨방쉐|씨방세|시방새|시방쉐|시방세|씹탱|씹창|씨발|씨벌|씨불|씨방|씨바|씨붕|씨부|씨밸|씨팔|씨펄|씨풀|씨빡|씨이발|씨이벌|씨이불|씨이방|씨이바|씨이붕|씨이부|씨이밸|씨이팔|씨이펄|씨이풀|씨이빡|씹할|씹팔|씹펄|씹풀|씹빡|띠발|띠벌|띠불|띠방|띠바|띠붕|띠밸|띠팔|띠펄|띠풀|띠이발|띠이벌|띠이불|띠이방|띠이바|띠이붕|띠이밸|띠이팔|띠이펄|띠이풀|시벌|시팔|시이발|시이벌|시이불|시이방|시이바|시이붕|시이부|시이밸|시이팔|시이펄|시이풀|시이빡|쒸발|쒸벌|쒸불|쒸방|쒸바|쒸붕|쒸부|쒸밸|쒸팔|쒸펄|쒸풀|쒸빡|쒸이발|쒸이벌|쒸이불|쒸이방|쒸이바|쒸이붕|쒸이부|쒸이밸|쒸이팔|쒸이펄|쒸이풀|쒸이빡|쉬발|쉬벌|쉬불|쉬방|쉬바|쉬붕|쉬부|쉬밸|쉬팔|쉬펄|쉬풀|쉬빡|쉬이발|쉬이벌|쉬이불|쉬이방|쉬이바|쉬이붕|쉬이부|쉬이밸|쉬이팔|쉬이펄|쉬이풀|쉬이빡|쓰발|쓰벌|쓰불|쓰방|쓰바|쓰붕|쓰부|쓰밸|쓰팔|쓰펄|쓰풀|쓰빡|쓰이발|쓰이벌|쓰이불|쓰이방|쓰이바|쓰이붕|쓰이부|쓰이밸|쓰이팔|쓰이펄|쓰이풀|쓰이빡|썅|c팔|c8|씝할|시발|싀발|스발|스벌|쉬이발|쓰으방|쉬빨|쉬팍|스벌|ㅅㅅㅣ팔|ㅅㅅㅣ팔|ㅆㅣ팔|씁알|씝알|씹알|씝탱|ㅆl팔|ㅆl발|쓰팍|씌팔|씌발|싀팔|ㅆ1팔|ㅆ1발|씹8|씹땡|씌벌|싀방|싀봉|씌방|ㅆI발|ㅅ1발|ㅆl발|ㅆi발|씨벨|시벵|시펄|씨밝|시밝|시벨|십샹|ㅆ│발|쒸뱅|씌파|씌빨|씌밸|씌바|쒸박|씨뱅|c발|^^ㅣ발|ㅅ1팔|ㅆㅣ불|ㅆㅂ|ㅅㅂ|씹발|개`|씨`발|싯팔|개씹|씨박|씨'발|씨벵|씨빨|씨파|씨브랄|씨팍|씹빨|씹쌍|ㅆㅣ발|ㅆㅣ방|ㅆㅣ팔|ㅆㅣ벌|ㅆ!발|ㅆㅣ발|쒸벨|시팍|시빨|시파|시밸|ㅆ1밸|ㅆ1벨|씌벨|씻팔|ㅆ1바|쓉창|씌뱅|씨팰|씌댕|씌뎅|씹빠|뻑큐|빠큐|ㅃr큐|쓰박|씨부랄|씹샹|시밟|섋|fuck|fuk|dildo|pussy|shit|bitch|anal|fetish|gay|lesbien|bastard|cunt|damn|asshole|돼지년|돼지놈|시x련|시x년|싶할|양키년|개걸래|걸래년|김치남|김치녀|시밭년|죽은련|죽은년|쓰레기년|ㅆㅣㅂㅏ/g,
    '어머'
  );
  input = input.replace(
    /개새끼|개쌔끼|십새끼|씹새끼|호로|좁밥|젖밥|젓밥|접밥|조빱|저빱|개새|개쉐|십쌔끼|십때끼|십세끼|개때끼|십색끼|십색히|십쉑히|십쉐리|십쉐이|십쉑|쌍년|썅년|쌍넌|썅넌|쌍뇬|썅뇬|개년|개넌|개뇬|쌍놈|썅놈|쌍넘|썅넘|개놈|개넘|개세끼|십새|병신|븅신|빙신|십쉐|등신|벼엉신|뷰웅신|비잉신|드응신|빙시|미친놈|미친넘|미췬놈|미췬넘|미친년|미친뇬|미친넌|미췬년|미췬뇬|미췬넌|개자식|씹쌔끼|개같은년|개같은놈|새끠|세끠|씹때끼|쉐끼|새뤼|쉐끼|쇄끼|쉐끼|쇅끼|씨키|세키|ㅅㅐ끼|ㅅㅐㄲㅣ|씹세끼|ㅅㅐㄲㅣ|ㅅㅐㄱㄱㅣ|새ㄱㄱㅣ|새ㄲㅣ|씹색끼|씹색히|뵹신|붕신|븅싄|뵹싄|병싄|씹쉑히|애자|ㅇㅐ자|씹쉐리|ㅇㅐㅈㅏ|섹히|색기|색히|병쉰|개색끼|씹쉐이|뱅신|뱅싄|뱅쉰|븽신|병쉰|애쟈|또라이|떠라이|씹쉑|샹년|상년|씹년|씹뇬|챵녀|챵년|창뇬|챵뇬|잡뇬|잡년|계같은뇬|개같은뇬|개섹|씹넘|씝년|ㄱH뇬|샹놈|샹늠|개색|개자슥|게세끼|씨입년|씨입뇬|뷩신|씹새|뱅신|세꺄|씹쉐|바부|듕신|새키|씹쌔|등쉬|바보새끼|개세|개샛끼|개쉬끼|개세끼|개쓰렉기|쉬키|색갸|세캬|식키|병신새끼|시키|새캬|듕시나|똘아이|똘추|ㅁ1친년|뮈친년|개색히|새끼|미췐년|벵신|병시나|병시|찐따|뷩시|새뀌|색귀|쌔끼|셥새|쉽년|쉽새|시바라|쉽팔|때끼|세끼|ㅅㅐㄲ|ㅅㅐㄱㄱ|ㅅㅐ끼|ㅅㅔㄲㅣ|ㅅHㄲI|색끼|ㅅH끼|개쇄|색히|새'끼|색끼|샹뇬|쇄키|섀끼|쌔기|쉑히|쉐리|씹세|쉑|등쉰|똘츄|뷩신|뷩쉰|븅쉰|빙쉰|개쉑히|쉽뇬|개련|호구|애좌|색휘|싯끼|섹키|쓉년|씹쒜|호로년|후레년|개섀끼|개샹련|잡놈|찌질이|호모|긔지|개쉐리|창녀|창년|갈보|개싑창|걸레년|차앙년|창ㄴㅕ|창뇬|촹년|촹뇬|비융신|병x|ㅄ|븅시나|병sin|병씬|미친새끼|개샛기|같은년|샹녀나|B융신|창남|개생퀴|개쉐이|개쉑|싸가지|싹아지/g,
    '아이'
  );
  input = input.replace(
    /염병|옘병|죶같은|죶가튼|미친|믜친|뮈친|ㅁl친|미칀|ㅁ1친|뮈췬|미췐|미튄|및친|ㅁㅣ친|ㅁl친|엠병|앰병|앰창|엠창|연병|호로|좆같은|좃같은|젖같은|젓같은|좆가튼|좃가튼|젖가튼|젓가튼|조까튼|저까튼/g,
    '나쁜'
  );
  input = input.replace(
    /좆까|좃까|젖까|젓까|조까|저까|좆도|좃도|젖도|조또|지랄|지럴|지롤|쥐랄|쥐럴|쥐롤|존니|죶나|죨라|죶니|죤니|죤나|죳나|조낸|g랄|zl랄|ㅈ1랄|좆나|좃나|존나|젖나|젓나|전나|졸라|절라/g,
    '매우'
  );
  input = input.replace(
    /니기미|닝기미|니주가리|니미|니애미|니에미|니엠|엠창|ㄴㅣㅁㅣ|ㄴlㅁl|늬미|니믜|니앰|앰창|애미|ㄴ1ㅇH미|늬귀미|ㄴㅣ미|ㄴㅣㄱㅣ|ㄴ1ㄱ1|ㄴ1ㅁ1|ㄴ1미|ㄴ1ㅇㅐ|ㄴ1애|니M창|니OH미|니뮈럴|늬기미|엿같은|느개비|느개미|느금띠|느그어메|느그어매|느금|늬에미|늬애비|늬에비|뉘에비|뉘에미|엠챵|애뮈|애뷔|엄마없|아빠없/g,
    '에이'
  );
  input = input.replace(
    /좆나게|좃나게|존나게|젖나게|젓나게|전나게|졸라게|절라게|ㅈ같은|ㅈ밥/g,
    '많이'
  );
  return input;
};
export default badwordsFiltering;
