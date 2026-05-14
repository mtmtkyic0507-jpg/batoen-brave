let playerName = "";
let playerTeam = [];
let cpuTeam = [];
let pIndex = 0;
let cIndex = 0;
let count = 1;
let gameOver = false;
let lastBattleCount = 1;
let gachaNeed = 0;
let gachaDrawn = 0;
let battleSession = 0;

let playerIsReady = false;
let cpuIsReady = false;

const rouletteSe = new Audio("https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3");
const hitSe = new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3");
const healSe = new Audio("https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3");
const rareSe = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3");

function playSound(sound){
  sound.currentTime = 0;
  sound.play().catch(()=>{});
}

const monsters = [
  {
    name:"スラリン",
    mark:"◯",
    commands:[
      {text:"スライムアタック",damage:15},
      {text:"ぷるぷるタックル",damage:20},
      {text:"☆全員に20ダメージ",markHit:"☆",damage:20},
      {text:"ミス",miss:true},
      {text:"やくそう",heal:25},
      {text:"全力たいあたり",damage:35}
    ]
  },
  {
    name:"ドラキチ",
    mark:"☆",
    commands:[
      {text:"かみつき",damage:20},
      {text:"炎の息",damage:30},
      {text:"◯全員に20ダメージ",markHit:"◯",damage:20},
      {text:"暴れて自分に20ダメージ",selfDamage:20},
      {text:"ミス",miss:true},
      {text:"灼熱の突撃",damage:45}
    ]
  },
  {
    name:"ゴーレム",
    mark:"◯",
    commands:[
      {text:"岩パンチ",damage:25},
      {text:"地ならし",damage:30},
      {text:"☆全員に20ダメージ",markHit:"☆",damage:20},
      {text:"石の体",heal:20},
      {text:"動けない",miss:true},
      {text:"巨岩落とし",damage:55}
    ]
  },
  {
    name:"ホネゾー",
    mark:"◯",
    commands:[
      {text:"骨投げ",damage:15},
      {text:"呪い",damage:30},
      {text:"☆全員に25ダメージ",markHit:"☆",damage:25},
      {text:"再生",heal:30},
      {text:"骨が折れた",selfDamage:25},
      {text:"怨念爆発",damage:45}
    ]
  },
  {
    name:"バーサーカー",
    mark:"◯",
    commands:[
      {text:"狂乱斬り",damage:45},
      {text:"暴走ラッシュ",damage:55},
      {text:"☆全員に30ダメージ",markHit:"☆",damage:30},
      {text:"自傷",selfDamage:35},
      {text:"ミス",miss:true},
      {text:"破壊神",damage:90}
    ]
  },
  {
    name:"しにがみ",
    mark:"☆",
    commands:[
      {text:"死神の鎌",damage:35},
      {text:"呪殺",damage:50},
      {text:"◯全員に25ダメージ",markHit:"◯",damage:25},
      {text:"ミス",miss:true},
      {text:"ミス",miss:true},
      {text:"デスサイズ",damage:95}
    ]
  },
  {
    name:"エンジェル",
    mark:"◯",
    commands:[
      {text:"光の矢",damage:25},
      {text:"祝福",heal:30},
      {text:"☆全員に20ダメージ",markHit:"☆",damage:20},
      {text:"天使の癒し",heal:50},
      {text:"ミス",miss:true},
      {text:"神の裁き",damage:65}
    ]
  },
  {
    name:"ピエロ",
    mark:"☆",
    commands:[
      {text:"ふざける",miss:true},
      {text:"ナイフ投げ",damage:25},
      {text:"笑撃",damage:35},
      {text:"◯全員に20ダメージ",markHit:"◯",damage:20},
      {text:"自分で転ぶ",selfDamage:20},
      {text:"狂気ショー",damage:75}
    ]
  },
  {
    name:"メタル",
    mark:"◯",
    commands:[
      {text:"逃げる",miss:true},
      {text:"硬い体",heal:20},
      {text:"体当たり",damage:15},
      {text:"☆全員に10ダメージ",markHit:"☆",damage:10},
      {text:"超回復",heal:50},
      {text:"メタル突撃",damage:80}
    ]
  },
  {
    name:"勇者",
    mark:"◯",
    rare:true,
    commands:[
      {text:"勇者斬り",damage:35},
      {text:"ギガスラッシュ",damage:50},
      {text:"仲間呼び",summon:true},
      {text:"ベホマ",heal:60},
      {text:"ミス",miss:true},
      {text:"伝説の一撃",damage:90}
    ]
  }
];

function hideAll(){
  document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
}

function createHero(){
  playerName = document.getElementById("nameInput").value.trim();

  if(!playerName){
    alert("名前を入力して！");
    return;
  }

  hideAll();
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("welcome").textContent = playerName + " が誕生した！";
}

function showBattleSelect(){
  hideAll();
  document.getElementById("select").classList.remove("hidden");
}

function showOnline(){
  hideAll();
  const online = document.getElementById("online");
  if(online) online.classList.remove("hidden");
}

function backToMenu(){
  hideAll();
  document.getElementById("menu").classList.remove("hidden");
}

function giveUpBattle(){
  backHome();
}

function backHome(){
  battleSession++;
  gameOver = true;

  hideAll();
  document.getElementById("home").classList.remove("hidden");

  playerTeam = [];
  cpuTeam = [];
  pIndex = 0;
  cIndex = 0;
  playerIsReady = false;
  cpuIsReady = false;

  const roulette = document.getElementById("roulette");
  const bigMessage = document.getElementById("bigMessage");
  const log = document.getElementById("log");
  const spinBtn = document.getElementById("spinBtn");

  if(roulette) roulette.textContent = "？";
  if(bigMessage) bigMessage.textContent = "";
  if(log) log.innerHTML = "バトル開始！";

  if(spinBtn){
    spinBtn.disabled = false;
    spinBtn.style.display = "inline-block";
  }
}

function startGame(n){
  battleSession++;
  count = n;
  lastBattleCount = n;
  playerTeam = [];
  cpuTeam = [];
  pIndex = 0;
  cIndex = 0;
  gameOver = false;
  playerIsReady = false;
  cpuIsReady = false;

  hideAll();
  document.getElementById("gacha").classList.remove("hidden");

  playGacha(n);
}

function restartBattle(){
  startGame(lastBattleCount);
}

function playGacha(n){
  gachaNeed = n;
  gachaDrawn = 0;

  const btn = document.getElementById("gachaBtn");
  btn.textContent = "魔王城の門をひらく";
  btn.onclick = drawFromCastle;
  btn.disabled = false;

  document.getElementById("gachaResult").innerHTML = "";
  document.getElementById("monsterAppear").textContent = "？";
  document.getElementById("monsterAppear").className = "";
  document.getElementById("monsterAppear").style.color = "white";
}

function copyMonster(base){
  return{
    name:base.name,
    mark:base.mark,
    hp:100,
    commands:base.commands,
    rare:!!base.rare
  };
}

function drawOneMonster(){
  if(Math.random() <= 0.04){
    const hero = monsters.find(m=>m.name==="勇者");
    return copyMonster(hero);
  }

  return drawNormalMonsterOnly();
}

function drawNormalMonsterOnly(){
  const normal = monsters.filter(m=>m.name !== "勇者");
  const base = normal[Math.floor(Math.random() * normal.length)];
  return copyMonster(base);
}

function drawFromCastle(){
  const btn = document.getElementById("gachaBtn");

  if(btn.disabled) return;
  if(gachaDrawn >= gachaNeed) return;

  const scene = document.querySelector(".castle-scene");
  const monsterText = document.getElementById("monsterAppear");

  btn.disabled = true;
  monsterText.textContent = "召喚中...";
  monsterText.className = "";
  monsterText.style.color = "white";

  scene.classList.add("castle-charge");

  setTimeout(()=>{
    const monster = drawOneMonster();
    playerTeam.push(monster);

    scene.classList.remove("castle-charge");
    scene.classList.add("castle-flash");

    if(monster.name === "勇者"){
      playSound(rareSe);
      monsterText.className = "rare-pop";
      monsterText.style.color = "gold";
    }else{
      monsterText.className = "monster-pop";
      monsterText.style.color = "white";
    }

    monsterText.textContent = monster.name;

    document.getElementById("gachaResult").innerHTML +=
      `<div>第${gachaDrawn + 1}体：${monster.name}（${monster.mark}）</div>`;

    gachaDrawn++;

    setTimeout(()=>{
      scene.classList.remove("castle-flash");

      if(gachaDrawn >= gachaNeed){
        btn.textContent = "順番を決める";
        btn.onclick = showPrepareScreen;
        btn.disabled = false;
      }else{
        btn.textContent = "次の魔王城の門をひらく";
        btn.disabled = false;
      }
    }, 2000);

  }, 1800);
}

function showPrepareScreen(){
  cpuTeam = gacha(count);

  playerIsReady = false;
  cpuIsReady = false;

  hideAll();
  document.getElementById("prepare").classList.remove("hidden");

  document.getElementById("preparePlayerName").textContent = playerName;
  document.getElementById("readyMessage").textContent = "";

  renderOrderLists();

  const playerReadyBtn = document.getElementById("playerReadyBtn");
  const cpuReadyBtn = document.getElementById("cpuReadyBtn");

  playerReadyBtn.disabled = false;
  playerReadyBtn.textContent = "準備OK";
  cpuReadyBtn.disabled = true;
  cpuReadyBtn.textContent = "相手の準備中...";

  setTimeout(()=>{
    cpuIsReady = true;
    cpuReadyBtn.textContent = "相手の準備OK";
    tryStartBattleAfterReady();
  }, 1600);
}

function renderOrderLists(){
  const playerList = document.getElementById("playerOrderList");
  const cpuList = document.getElementById("cpuOrderList");

  playerList.innerHTML = playerTeam.map((m,i)=>`
    <div class="order-item">
      <div class="order-name">${i + 1}. ${m.name}</div>
      <div class="order-type">${m.mark} 種族 / HP ${m.hp}</div>

      <div class="order-buttons">
        <button class="small-btn" onclick="movePlayerMonster(${i}, -1)">上へ</button>
        <button class="small-btn" onclick="movePlayerMonster(${i}, 1)">下へ</button>
      </div>
    </div>
  `).join("");

  cpuList.innerHTML = cpuTeam.map((m,i)=>`
    <div class="order-item">
      <div class="order-name">${i + 1}. ${m.name}</div>
      <div class="order-type">${m.mark} 種族 / HP ${m.hp}</div>
    </div>
  `).join("");
}

function movePlayerMonster(index, dir){
  if(playerIsReady) return;

  const next = index + dir;

  if(next < 0 || next >= playerTeam.length) return;

  const temp = playerTeam[index];
  playerTeam[index] = playerTeam[next];
  playerTeam[next] = temp;

  renderOrderLists();
}

function playerReady(){
  playerIsReady = true;

  const btn = document.getElementById("playerReadyBtn");
  btn.disabled = true;
  btn.textContent = "準備OK済み";

  tryStartBattleAfterReady();
}

function tryStartBattleAfterReady(){
  const msg = document.getElementById("readyMessage");

  if(playerIsReady && cpuIsReady){
    msg.textContent = "両者準備OK！バトル開始！！";

    setTimeout(()=>{
      finishPrepareAndStartBattle();
    },1200);
  }else if(playerIsReady){
    msg.textContent = "相手の準備を待っています...";
  }else if(cpuIsReady){
    msg.textContent = "相手は準備OK！";
  }
}

function finishPrepareAndStartBattle(){
  pIndex = 0;
  cIndex = 0;
  gameOver = false;

  hideAll();
  document.getElementById("battle").classList.remove("hidden");

  const spinBtn = document.getElementById("spinBtn");
  spinBtn.style.display = "inline-block";
  spinBtn.disabled = false;

  const resultButtons = document.getElementById("resultButtons");
  if(resultButtons) resultButtons.classList.add("hidden");

  document.getElementById("roulette").textContent = "？";
  document.getElementById("bigMessage").textContent = "";
  document.getElementById("bigMessage").style.color = "#003f5c";
  document.getElementById("log").innerHTML = "バトル開始！";

  update();
  showCommandDetails();
}

function gacha(n){
  const arr = [];
  for(let i=0; i<n; i++){
    arr.push(drawOneMonster());
  }
  return arr;
}

function player(){
  return playerTeam[pIndex];
}

function cpu(){
  return cpuTeam[cIndex];
}

function showTurnMessage(text,color){
  const msg = document.getElementById("bigMessage");

  msg.textContent = text;
  msg.style.color = color;
  msg.classList.remove("turn-pop");
  void msg.offsetWidth;
  msg.classList.add("turn-pop");
}

function spinRoulette(callback){
  let timerCount = 0;
  const finalRoll = Math.floor(Math.random() * 6);
  const roulette = document.getElementById("roulette");
  const marks = ["⚡","🔥","💧","✨","💥","🌙"];

  playSound(rouletteSe);
  roulette.classList.add("roulette-spin");

  const timer = setInterval(()=>{
    roulette.textContent = marks[Math.floor(Math.random() * marks.length)];
    timerCount++;

    if(timerCount >= 24){
      clearInterval(timer);
      roulette.classList.remove("roulette-spin");
      roulette.textContent = finalRoll + 1;

      roulette.classList.remove("result-pop");
      void roulette.offsetWidth;
      roulette.classList.add("result-pop");

      setTimeout(()=>{
        callback(finalRoll);
      }, 350);
    }
  }, 55);
}

function playerSpin(){
  if(gameOver) return;

  const session = battleSession;

  showTurnMessage("君のターン！！","#00cc44");

  document.getElementById("spinBtn").disabled = true;

  setTimeout(()=>{
    if(gameOver || session !== battleSession) return;

    spinRoulette((roll)=>{
      if(gameOver || session !== battleSession) return;

      useCommand(player(),cpu(),roll,"player");
      update();
      showCommandDetails();

      if(checkDead()) return;

      setTimeout(()=>{
        if(gameOver || session !== battleSession) return;
        cpuSpin();
      },1200);
    });
  },700);
}

function cpuSpin(){
  if(gameOver) return;

  const session = battleSession;

  showTurnMessage("相手のターン！！","#ff2222");

  setTimeout(()=>{
    if(gameOver || session !== battleSession) return;

    spinRoulette((roll)=>{
      if(gameOver || session !== battleSession) return;

      useCommand(cpu(),player(),roll,"cpu");
      update();
      showCommandDetails();

      if(checkDead()) return;

      document.getElementById("spinBtn").disabled = false;
    });
  },700);
}

function useCommand(attacker,defender,roll,side){
  if(!attacker || !defender) return;

  const cmd = attacker.commands[roll];

  let detail = "";

  if(cmd.summon){
    const allies = [
      drawNormalMonsterOnly(),
      drawNormalMonsterOnly(),
      drawNormalMonsterOnly()
    ];

    detail += `${allies[0].name} と ${allies[1].name} と ${allies[2].name} が駆けつけた！！<br><br>`;

    allies.forEach(a=>{
      const attack = a.commands[Math.floor(Math.random() * 6)];

      detail += `【${a.name}】${attack.text}<br>`;

      if(attack.miss){
        detail += `しかし何も起きなかった！<br><br>`;
      }else if(attack.heal){
        attacker.hp = Math.min(100, attacker.hp + attack.heal);
        playSound(healSe);
        detail += `${attacker.name}が ${attack.heal} 回復！<br><br>`;
      }else if(attack.selfDamage){
        playSound(hitSe);
        detail += `${a.name}は ${attack.selfDamage} ダメージを受けた！<br><br>`;
      }else if(attack.markHit){
        const targets = side === "player" ? cpuTeam : playerTeam;
        let hitCount = 0;

        targets.forEach(m=>{
          if(m.hp > 0 && m.mark === attack.markHit){
            m.hp = Math.max(0, m.hp - attack.damage);
            hitCount++;
          }
        });

        playSound(hitSe);
        detail += `${attack.markHit}種族 ${hitCount}体に ${attack.damage} ダメージ！<br><br>`;
      }else if(attack.damage){
        defender.hp = Math.max(0, defender.hp - attack.damage);
        playSound(hitSe);
        detail += `${defender.name}に ${attack.damage} ダメージ！<br><br>`;
      }
    });

    document.getElementById("bigMessage").style.color = "#003f5c";
    document.getElementById("bigMessage").textContent = "仲間呼び 発動！！";
    document.getElementById("log").innerHTML = detail;

    shakeScreen();
    return;
  }

  if(cmd.miss){
    detail = "しかし何も起きなかった！";
  }else if(cmd.heal){
    attacker.hp = Math.min(100, attacker.hp + cmd.heal);
    playSound(healSe);
    detail = `${attacker.name}は ${cmd.heal} 回復！`;
  }else if(cmd.selfDamage){
    attacker.hp = Math.max(0, attacker.hp - cmd.selfDamage);
    playSound(hitSe);
    detail = `${attacker.name}は ${cmd.selfDamage} ダメージを受けた！`;
    shakeScreen();
  }else if(cmd.markHit){
    const targets = side === "player" ? cpuTeam : playerTeam;
    let hitCount = 0;

    targets.forEach(m=>{
      if(m.hp > 0 && m.mark === cmd.markHit){
        m.hp = Math.max(0, m.hp - cmd.damage);
        hitCount++;
      }
    });

    playSound(hitSe);
    detail = `${cmd.markHit}種族 ${hitCount}体に ${cmd.damage} ダメージ！`;
    shakeScreen();
  }else if(cmd.damage){
    defender.hp = Math.max(0, defender.hp - cmd.damage);
    playSound(hitSe);
    detail = `${defender.name}に ${cmd.damage} ダメージ！`;
    shakeScreen();
  }

  document.getElementById("bigMessage").style.color = "#003f5c";
  document.getElementById("bigMessage").textContent =
    `${attacker.name} が ${cmd.text}！！`;

  document.getElementById("log").innerHTML = detail;
}

function shakeScreen(){
  const battle = document.getElementById("battle");

  battle.classList.remove("screen-shake");
  void battle.offsetWidth;
  battle.classList.add("screen-shake");
}

function checkDead(){
  const currentCpu = cpu();
  const currentPlayer = player();

  if(currentCpu && currentCpu.hp <= 0){
    document.getElementById("log").innerHTML += `<br>CPUの${currentCpu.name}は倒れた！`;

    cIndex++;

    if(cIndex >= count){
      finishBattle(`${playerName}の勝ち！`);
      return true;
    }

    setTimeout(()=>{
      if(gameOver) return;

      document.getElementById("log").innerHTML = `CPUは${cpu().name}を出した！`;
      document.getElementById("bigMessage").textContent = "";
      update();
      showCommandDetails();
      document.getElementById("spinBtn").disabled = false;
    },900);

    return true;
  }

  if(currentPlayer && currentPlayer.hp <= 0){
    document.getElementById("log").innerHTML += `<br>${playerName}の${currentPlayer.name}は倒れた！`;

    pIndex++;

    if(pIndex >= count){
      finishBattle("CPUの勝ち！");
      return true;
    }

    setTimeout(()=>{
      if(gameOver) return;

      document.getElementById("log").innerHTML = `${playerName}は${player().name}を出した！`;
      document.getElementById("bigMessage").textContent = "";
      update();
      showCommandDetails();

      setTimeout(()=>{
        if(gameOver) return;
        cpuSpin();
      },900);
    },900);

    return true;
  }

  return false;
}

function finishBattle(message){
  gameOver = true;

  document.getElementById("bigMessage").style.color = "#003f5c";
  document.getElementById("bigMessage").textContent = message;
  document.getElementById("log").innerHTML += `<br><br>${message}`;

  const spinBtn = document.getElementById("spinBtn");
  spinBtn.style.display = "none";

  const resultButtons = document.getElementById("resultButtons");
  if(resultButtons) resultButtons.classList.remove("hidden");
}

function update(){
  const p = player();
  const c = cpu();

  if(!p || !c) return;

  document.getElementById("pName").textContent = playerName;
  document.getElementById("pChar").textContent = p.name + ` ${pIndex + 1}/${count}`;
  document.getElementById("pType").textContent = p.mark + " 種族";
  document.getElementById("pHp").textContent = p.hp;
  document.getElementById("pBar").style.width = p.hp + "%";

  document.getElementById("cChar").textContent = c.name + ` ${cIndex + 1}/${count}`;
  document.getElementById("cType").textContent = c.mark + " 種族";
  document.getElementById("cHp").textContent = c.hp;
  document.getElementById("cBar").style.width = c.hp + "%";
}

function showCommandDetails(){
  const area = document.getElementById("commandDetails");
  const p = player();

  if(!area || !p){
    if(area) area.innerHTML = "";
    return;
  }

  area.innerHTML = `
    <div>【${p.name}】${p.name === "勇者" ? " ★超レア" : ""}</div>
    ${p.commands.map((cmd,i)=>`${i + 1}. ${cmd.text}`).join("<br>")}
  `;
}
/* =========================
   ONLINE
========================= */

let currentRoom = null;
let isHost = false;

/* 部屋作成 */

function createRoom(){

  const code =
    Math.random()
      .toString(36)
      .substring(2,8)
      .toUpperCase();

  currentRoom = code;
  isHost = true;

  const roomRef =
    window.dbRef(
      window.db,
      "rooms/" + code
    );

  window.dbSet(roomRef,{
    host:playerName,
    guest:"",
    status:"waiting"
  });

  document.getElementById("roomStatus")
    .innerHTML =
      `
      部屋コード：
      <b>${code}</b>
      <br>
      友達にこのコードを送って！
      `;

  waitGuest(code);
}

/* 相手待機 */

function waitGuest(code){

  const roomRef =
    window.dbRef(
      window.db,
      "rooms/" + code
    );

  window.dbOnValue(roomRef,(snapshot)=>{

    const data = snapshot.val();

    if(!data) return;

    if(data.guest){

      document.getElementById("roomStatus")
        .innerHTML =
          `
          ${data.guest} が参加！
          <br>
          対戦開始！
          `;

      setTimeout(()=>{

        hideAll();

        document
          .getElementById("select")
          .classList
          .remove("hidden");

      },1500);

    }

  });

}

/* 部屋参加 */

function joinRoom(){

  const code =
    document
      .getElementById("roomInput")
      .value
      .trim()
      .toUpperCase();

  if(!code){
    alert("部屋コードを入力！");
    return;
  }

  currentRoom = code;
  isHost = false;

  const roomRef =
    window.dbRef(
      window.db,
      "rooms/" + code
    );

  window.dbUpdate(roomRef,{
    guest:playerName,
    status:"ready"
  });

  document.getElementById("roomStatus")
    .innerHTML =
      `
      部屋に参加しました！
      <br>
      ホストを待っています...
      `;

  setTimeout(()=>{

    hideAll();

    document
      .getElementById("select")
      .classList
      .remove("hidden");

  },1500);

}
