@echo off

echo Starting PHP server...
start "" php artisan serve

echo Starting npm development server...
start "" npm run dev

echo All servers started successfully.
