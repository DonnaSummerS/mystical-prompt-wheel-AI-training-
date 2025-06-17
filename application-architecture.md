# Daily AI Prompt Wheel - Application Architecture

This document outlines the architecture of the Daily AI Prompt Wheel application, showing the main components and their relationships.

## Architecture Diagram

```mermaid
flowchart TD
    %% Main Components
    User([User])
    UI[User Interface Layer]
    Core[Core Functionality]
    Data[Data Management]
    Effects[Visual Effects System]
    
    %% UI Components
    subgraph UI[User Interface Layer]
        Wheel[Wheel Component]
        AdminUI[Admin Panel]
        Modals[Modal System]
        Button[Spin Button]
    end
    
    %% Core Components
    subgraph Core[Core Functionality]
        SpinLogic[Spin Mechanism]
        Timer[Cooldown Timer]
        AdminLogic[Admin Controls]
        PasscodeSystem[Passcode Validation]
    end
    
    %% Data Components
    subgraph Data[Data Management]
        LocalStorage[(LocalStorage)]
        StateManagement[Application State]
    end
    
    %% Effects Components
    subgraph Effects[Visual Effects System]
        Particles[Particle Engine]
        Animations[CSS Animations]
        RunicEffects[Runic Tablet Effects]
    end
    
    %% Relationships - User Interactions
    User -->|Interacts with| Button
    User -->|Accesses| AdminUI
    User -->|Views| Modals
    
    %% Relationships - UI to Core
    Button -->|Triggers| SpinLogic
    AdminUI -->|Uses| AdminLogic
    AdminUI -->|Validates via| PasscodeSystem
    
    %% Relationships - Core to Data
    SpinLogic -->|Updates| StateManagement
    Timer -->|Reads/Updates| StateManagement
    AdminLogic -->|Modifies| StateManagement
    StateManagement <-->|Persists| LocalStorage
    
    %% Relationships - Core to UI
    SpinLogic -->|Rotates| Wheel
    SpinLogic -->|Shows| Modals
    Timer -->|Updates| Button
    
    %% Relationships - Effects Integration
    SpinLogic -->|Triggers| Particles
    SpinLogic -->|Activates| RunicEffects
    AdminLogic -->|Triggers| Animations
    Button -->|Triggers| Particles
    
    %% Data Flow
    LocalStorage -->|Loads on init| StateManagement
    StateManagement -->|Configures| UI
    
    classDef userNode fill:#4672b4,color:white,stroke:#333,stroke-width:1px
    classDef uiLayer fill:#47956f,color:white,stroke:#333,stroke-width:1px
    classDef coreLayer fill:#de953e,color:white,stroke:#333,stroke-width:1px
    classDef dataLayer fill:#8b251e,color:white,stroke:#333,stroke-width:1px
    classDef effectsLayer fill:#8b251e,color:white,stroke:#333,stroke-width:1px
    
    class User userNode
    class UI,Wheel,AdminUI,Modals,Button uiLayer
    class Core,SpinLogic,Timer,AdminLogic,PasscodeSystem coreLayer
    class Data,LocalStorage,StateManagement dataLayer
    class Effects,Particles,Animations,RunicEffects effectsLayer
```

## Component Descriptions

### User Interface Layer
- **Wheel Component**: The central 5-segment wheel with ornate decorations
- **Admin Panel**: Interface for managing tips, background, and music
- **Modal System**: Handles tip display, admin access, and music settings
- **Spin Button**: Primary interaction point for users

### Core Functionality
- **Spin Mechanism**: Handles wheel rotation, segment selection, and cooldown
- **Cooldown Timer**: Manages 24-hour lockout period
- **Admin Controls**: Processes tip management and media uploads
- **Passcode Validation**: Secures admin and music settings

### Data Management
- **LocalStorage**: Persists application data in browser storage
- **Application State**: In-memory state management for the application

### Visual Effects System
- **Particle Engine**: Creates and manages magical particle effects
- **CSS Animations**: Handles transitions, glows, and ambient effects
- **Runic Tablet Effects**: Controls floating tablets and their behaviors

## Data Flow

1. On initialization, the application loads saved state from LocalStorage
2. User interactions trigger Core Functionality components
3. Core components update Application State and trigger Visual Effects
4. State changes are persisted to LocalStorage
5. UI components reflect the current application state

This architecture ensures separation of concerns while maintaining a cohesive user experience with rich visual effects.
