@echo off

echo Starting PHP server...
start "" php artisan serve

echo Starting npm development server...
start "" npm run dev

echo Starting queue worker...
start "" php artisan queue:work