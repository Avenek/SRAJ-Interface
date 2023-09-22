class CharacterEffect {
  constructor(id) {
    this.action = "CREATE_IF_NOT_EXIST";
    this.id = id
    this.windowTarget = "MAP"
    this.target = new Target();
    this.effect = "ANIMATION";
    this.params = new AnimationParams();
  }
}

class Target {
  constructor() {
    this.kind = "HERO"
  }
}

class AnimationParams {
  constructor() {
    this.gifUrl = "characterEffects/.gif";
    this.repeat = 1;
    this.opacity=1;
    this.position = "CENTER"
    this.behind = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.speechBubble = false;
  }
}

class FakeNpc {
  constructor(id) {
    this.action = "CREATE_IF_NOT_EXIST";
    this.id = id
    this.x = 0
    this.y = 0
    this.img = "/npc/test.gif"
    this.behavior = new Behavior();
  }
}

class FakeNpcBehavior{
  constructor(){
    this.name = "IDLE"
    this.duration = 5
    this.dir = "S"
  }
}

class Behavior {
  constructor() {
    this.repeat = 1
    this.list = [new(FakeNpcBehavior)]
  }
}

class CallInstantBehaviorFakeNpc{
  constructor(id) {
  this.id = id
  this.repeat = 1
  this.list = [new(FakeNpcBehavior)]
  }
}

class CharacterHide{
  constructor() {
    this.action = "CREATE"
    this.kind = "HERO"
    this.showTip = false
    }
}

class EmoDefinitions{
  constructor() {
    this.name = "obiekt-0"
    this.priority = 90
    this.params = new EmoDefinitionsParams()
    }
}

class EmoDefinitionsParams{
  constructor(){
    this.action = "onSelf"
    this.filename = "battle.gif"
  }
}

class EmoActions{
  constructor(){
    this.action = "CREATE"
    this.name = "obiekt-0"
    this.target = new NpcTarget()
  }
}

class NpcTarget {
  constructor() {
    this.kind = "NPC"
    this.id = 0
  }
}

class Weather{
  constructor(){
    this.action = "CREATE"
    this.name = "Rain"
    this.speedX = 1
    this.speedY = 1
  }
}

class EarthQuake{
  constructor(){
    this.duration = 0.1
    this.quantity = 5
    this.frequency = 0.7
    this.power = 10
  }
}

class ExtraLight{
  constructor(id){
    this.action = "CREATE"
    this.id = id
    this.d = new ExtraLightData()
  }
}

class ExtraLightData{
  constructor(){
    this.x = 0
    this.y = 0
    this.r = 30
    this.offsetX = 0
    this.offsetY = 0
    this.gradientPercent1 = 40
    this.gradientPercent2 = 40
  }
}



class Case {
  constructor() {
    this.kind = "ARGUMENT";
    this.key = "QUEST"
    this.name = "ACTIVE"
    this.params = []
  }
}

class GetRandom {
  constructor() {
    this.resultType = "int"
    this.start = 0
    this.end = 1
  }
}

class GetCharacterData {
  constructor(path) {
    this.kind = "HERO"
    this.toGet = path
    this.modify = 0
    this. rotation = {"x":0, "y":0}
  }
}

class Light{
  constructor(){
    this.onlyNight = true,
    this.r = 20
    this.color = new Color()
  }
}

class Color{
  constructor() {
    this.r = 0
    this.g = 0
    this.b = 0
    this.a = 1
  }
}

class Master{
  constructor(){
    this.kind = "THIS_NPC_INSTANCE"
  }
}




let objectDict = {
  characterEffect : class CharacterEffect {
      constructor(id) {
        this.action = "CREATE_IF_NOT_EXIST";
        this.id = id
        this.windowTarget = "MAP"
        this.target = new Target();
        this.effect = "ANIMATION";
        this.params = new AnimationParams();
      }
    },
  
    case : class Case {
        constructor() {
          this.kind = "ARGUMENT";
          this.key = "QUEST"
          this.name = "ACTIVE"
          this.params = []
      }
    },

    fakeNpc: class FakeNpc {
      constructor(id) {
        this.action = "CREATE_IF_NOT_EXIST";
        this.id = id
        this.x = 0
        this.y = 0
        this.img = "/npc/test.gif"
        this.behavior = new Behavior();
      }
    },
    
    behavior: class Behavior {
      constructor() {
        this.repeat = 1
        this.list = []
      }
    },
  
  fakeNpcBehavior: class FakeNpcBehavior{
    constructor(){
      this.name = "WALK"
      this.x = 0
      this.y = 0
    }
  },

  callInstantBehaviorFakeNpc : class CallInstantBehaviorFakeNpc{
    constructor(id) {
    this.id = id
    this.repeat = 1
    this.list = [new(FakeNpcBehavior)]
    }
  },

  characterHide : class CharacterHide{
    constructor() {
      this.action = "CREATE"
      this.kind = "HERO"
      this.showTip = false
    }
  },

  emoDefinitions : class EmoDefinitions{
    constructor() {
      this.name = "obiekt-0"
      this.priority = 90
      this.params = new EmoDefinitionsParams()
    }
  },

  emoActions : class EmoActions{
    constructor(){
      this.action = "CREATE"
      this.name = "obiekt-0"
      this.target = new NpcTarget()
    }
  },

  weather : class Weather{
    constructor(){
      this.action = "CREATE"
      this.name = "Rain"
      this.speedX = 1
      this.speedY = 1
    }
  },

  earthQuake : class EarthQuake{
    constructor(){
      this.duration = 0.1
      this.quantity = 5
      this.frequency = 0.7
      this.power = 10
    }
  },

  extraLight : class ExtraLight{
    constructor(id){
      this.action = "CREATE"
      this.id = id
      this.d = new ExtraLightData()
    }
  }
}
