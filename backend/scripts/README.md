# Reset database (drop and recreate all tables)
```bash
docker compose exec api python scripts/reset_db.py
```

# Seed with mock data
```bash
docker compose exec api python scripts/seed_data.py
```

# Or combine: reset + seed
```bash
docker compose exec api python scripts/reset_db.py && docker compose exec api python scripts/seed_data.py
```