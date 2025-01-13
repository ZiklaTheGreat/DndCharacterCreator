# Inštalácia a Spustenie Aplikácie
## Predpoklady
Pred inštaláciou aplikácie sa uistite, že máte nainštalované nasledujúce nástroje:
- **Node.js**: Potrebný na spustenie backendu a buildovanie frontend aplikácie. Verzia 16 alebo novšia. [Stiahnuť Node.js](https://nodejs.org/)
- **npm**: Nástroj na správu balíčkov, súčasťou Node.js.
- **MongoDB**: Lokálny MongoDB server alebo MongoDB Atlas. [Stiahnuť MongoDB](https://www.mongodb.com/try/download/community)
## Klonovanie Projektu
Ak je projekt uložený v Git repozitári, postupujte nasledovne: 1. Otvorte terminál a spustite príkaz na klonovanie projektu: ```bash git clone <URL repozitára> ```
## Inštalácia Závislostí
Projekt pozostáva z **backendu** (server) a **frontendu** (klient). Je potrebné nainštalovať závislosti pre obe časti.
### Pre backend:
1. Prejdite do adresára `backend`: ```bash cd backend ``` 2. Nainštalujte závislosti: ```bash npm install ```
### Pre frontend:
1. Prejdite späť do koreňového adresára: ```bash cd .. ``` 2. Nainštalujte závislosti: ```bash npm install ```
## Spustenie Aplikácie
Na spustenie aplikácie použite **dva samostatné terminály**.
### Backend:
1. Prejdite do adresára `backend`: ```bash cd backend ``` 2. Spustite server v režime vývoja: ```bash npm run dev ```
### Frontend:
1. Prejdite do adresára frontend (ak sa nachádza v koreňovom adresári): ```bash cd frontend ``` 2. Spustite frontend aplikáciu: ```bash npm start ```
## Prístup k Aplikácii
Po úspešnom spustení backendu aj frontendu otvorte webový prehliadač a prejdite na: ``` http://localhost:3000 ```
## Riešenie Problémov
### Backend server sa nespustí:
- Skontrolujte, či je MongoDB server spustený. - Uistite sa, že port `5000` nie je obsadený iným procesom.
### Frontend server sa nespustí:
- Skontrolujte, či je port `3000` dostupný. - Ak nie, použite alternatívny port: ```bash PORT=3001 npm start ```
### Obrázky sa neukladajú alebo nemažú:
- Skontrolujte, či adresár `backend/uploads` existuje a server má oprávnenie doň zapisovať.
