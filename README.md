Inštalácia a Spustenie Aplikácie
Predpoklady

Pred inštaláciou aplikácie sa uistite, že máte nainštalované nasledujúce nástroje:

    Node.js: Potrebný na spustenie backendu a buildovanie frontend aplikácie. Verzia 16 alebo novšia. Stiahnuť Node.js
    npm: Nástroj na správu balíčkov, súčasťou Node.js.
    MongoDB: Lokálny MongoDB server alebo MongoDB Atlas. Stiahnuť MongoDB
    Git (voliteľné): Na klonovanie projektu. Stiahnuť Git

Klonovanie Projektu

Ak je projekt uložený v Git repozitári, postupujte nasledovne:

    Otvorte terminál a spustite príkaz na klonovanie projektu:

    git clone <URL repozitára>

Inštalácia Závislostí

Projekt pozostáva z backendu (server) a frontendu (klient). Je potrebné nainštalovať závislosti pre obe časti.

Pre backend:

    cd backend
    npm install

Pre frontend:

    cd ..
    npm install

Spustenie Aplikácie

Na spustenie aplikácie použite dva samostatné terminály.

    Backend:

cd backend
npm run dev

Frontend:

    cd frontend
    npm start

Prístup k Aplikácii

Po úspešnom spustení backendu aj frontendu otvorte webový prehliadač a prejdite na:

http://localhost:3000
Riešenie Problémov

Backend server sa nespustí:
    Skontrolujte, či je MongoDB server spustený.
    Uistite sa, že port 5000 nie je obsadený iným procesom.

Frontend server sa nespustí:
    Skontrolujte, či je port 3000 dostupný.
    Ak nie, použite príkaz:

        PORT=3001 npm start

Obrázky sa neukladajú alebo nemažú:
    Skontrolujte, či adresár backend/uploads existuje a server má oprávnenie doň zapisovať.
