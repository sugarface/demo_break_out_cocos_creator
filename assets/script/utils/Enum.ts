export enum RoundController {
    NewRound = "new_round",
    StartGame = "start_game",
    Continue = "continue_game",
    ResetGame = "reset_game",
    LevelUp = "level_up",
    NextLevel = "next_level",
    LostTurn = "lost_turn",
    Collect = "collect",
    Win = "win",
    LoseGame = "lose_game",
}

export enum EventName {
    BreakBrick = "break_brick",
    BricksValue = "bricks_value",
    CollideBoss = "collide_boss",
    Expand = "expand",
}

export enum DelayTime {
    NewRound = 1,
    StartGame = 2.5,
}

export enum PhysicalTag {
    Brick = 1,
    Ground = 2,
    MovingBar = 3,
    Wall = 4,
}


export enum ColorLable {
    Disable = "#888888",
    Default = "#ffffff",
}

export enum TimeLeftLevel {
    Level1 = 60,
    Level2 = 75,
    Level3 = 90,
}

export enum GameLevel {
    Level1 = 1,
    Level2 = 2,
    Level3 = 3,
}

export enum RemainingTurn {
    Default = 0,
    OneTurn = 1,
    TwoTurns = 2,
    ThreeTurns = 3
}