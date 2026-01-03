#!/usr/bin/env python3
"""
Seed script to populate the database with extensive mock data.
Uses a fixed seed for reproducible, consistent data between runs.

Usage:
    python scripts/seed_data.py              # Seed the database
    python scripts/seed_data.py --dry-run    # Preview without inserting
    python scripts/seed_data.py --verify     # Count records in tables
    python scripts/seed_data.py --clear      # Clear all data first
"""
import argparse
import asyncio
import random
import sys
from datetime import datetime, date, time, timedelta
from decimal import Decimal
from pathlib import Path
from typing import List, Dict, Any

from faker import Faker

# Add parent dir to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import engine, async_session_factory, Base
from app.models import *
from app.models.enums import *

# Fixed seed for reproducibility
SEED = 42
random.seed(SEED)
fake = Faker(['en_US'])
fake.seed_instance(SEED)

# ============================================================================
# CONFIGURATION - Adjust counts as needed
# ============================================================================
CONFIG = {
    'users': 50,
    'players': 40,      # Must be <= users
    'teams': 15,
    'fields': 10,
    'bookings': 60,
    'matches': 40,
    'posts': 50,
    'comments': 100,
    'reactions': 150,
    'notifications': 100,
    'reports': 20,
    'calendar_days': 14,  # Days of calendar slots to generate
}

# UK Cities with coordinates
UK_CITIES = [
    ("London", 51.5074, -0.1278),
    ("Manchester", 53.4808, -2.2426),
    ("Birmingham", 52.4862, -1.8904),
    ("Liverpool", 53.4084, -2.9916),
    ("Leeds", 53.8008, -1.5491),
    ("Glasgow", 55.8642, -4.2518),
    ("Sheffield", 53.3811, -1.4701),
    ("Edinburgh", 55.9533, -3.1883),
    ("Bristol", 51.4545, -2.5879),
    ("Cardiff", 51.4816, -3.1791),
]

POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward", "Striker", "Winger"]
TEAM_SUFFIXES = ["FC", "United", "City", "Athletic", "Rovers", "Wanderers", "Hotspur", "Town"]
FIELD_TYPES = ["5v5", "7v7", "11v11"]
AMENITIES = ["Parking", "Changing Room", "Showers", "Lighting", "Water Fountain", 
             "First Aid", "Canteen", "WiFi", "Spectator Area", "Security"]


# ============================================================================
# DATA GENERATORS
# ============================================================================
def generate_users(count: int) -> List[Dict]:
    """Generate user accounts with various roles."""
    users = []
    roles_dist = [
        ([UserRole.PLAYER.value], 60),
        ([UserRole.PLAYER.value, UserRole.TEAM_LEADER.value], 20),
        ([UserRole.FIELD_OWNER.value], 15),
        ([UserRole.MODERATOR.value], 5),
    ]
    
    for i in range(count):
        # Pick role based on distribution
        roll = random.randint(1, 100)
        cumulative = 0
        for roles, pct in roles_dist:
            cumulative += pct
            if roll <= cumulative:
                selected_roles = roles
                break
        
        city, lat, lng = random.choice(UK_CITIES)
        users.append({
            'username': f"user_{i+1:03d}",
            'email': f"user_{i+1:03d}@example.com",
            'password_hash': "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VlH4pBQf7J8Kmu",  # password123
            'roles': selected_roles,
            'status': AccountStatus.ACTIVE,
            'is_verified': True,
            'contact_info': fake.phone_number(),
            'location': city,
            'latitude': lat + random.uniform(-0.05, 0.05),
            'longitude': lng + random.uniform(-0.05, 0.05),
        })
    return users


def generate_players(users: List[UserAccount]) -> List[Dict]:
    """Generate player profiles for users with Player role."""
    players = []
    player_users = [u for u in users if UserRole.PLAYER.value in u.roles][:CONFIG['players']]
    
    for user in player_users:
        players.append({
            'user_id': user.user_id,
            'display_name': fake.name(),
            'position': random.choice(POSITIONS),
            'skill_level': random.randint(3, 10),
            'bio': fake.sentence(nb_words=10),
            'date_of_birth': fake.date_of_birth(minimum_age=16, maximum_age=45),
            'height': round(random.uniform(160, 195), 1),
            'weight': round(random.uniform(55, 95), 1),
            'preferred_foot': random.choice(list(PreferredFoot)),
        })
    return players


def generate_teams(users: List[UserAccount]) -> List[Dict]:
    """Generate team profiles."""
    teams = []
    used_names = set()
    leaders = [u for u in users if UserRole.TEAM_LEADER.value in u.roles]
    
    for i in range(min(CONFIG['teams'], len(leaders))):
        city, lat, lng = random.choice(UK_CITIES)
        status = random.choices(
            [TeamStatus.VERIFIED, TeamStatus.PENDING, TeamStatus.PENDING_REVISION, TeamStatus.REJECTED],
            weights=[60, 20, 15, 5]
        )[0]
        
        # Generate unique team name
        for attempt in range(10):
            if random.random() > 0.5:
                team_name = f"{city} {random.choice(TEAM_SUFFIXES)}"
            else:
                team_name = f"{fake.last_name()} {random.choice(TEAM_SUFFIXES)}"
            if team_name not in used_names:
                used_names.add(team_name)
                break
        else:
            # Fallback: append index to ensure uniqueness
            team_name = f"{fake.last_name()} {random.choice(TEAM_SUFFIXES)} {i+1}"
            used_names.add(team_name)

        teams.append({
            'team_name': team_name,
            'description': fake.paragraph(nb_sentences=2),
            'logo_url': f"https://picsum.photos/seed/team{i}/200",
            'leader_id': leaders[i].user_id,
            'status': status,
            'rejection_reason': fake.sentence() if status == TeamStatus.REJECTED else None,
            'location': city,
            'latitude': lat + random.uniform(-0.05, 0.05),
            'longitude': lng + random.uniform(-0.05, 0.05),
            'skill_level': random.randint(3, 9),
        })
    return teams


def generate_fields(users: List[UserAccount]) -> List[Dict]:
    """Generate field profiles."""
    fields = []
    owners = [u for u in users if UserRole.FIELD_OWNER.value in u.roles]
    
    for i in range(min(CONFIG['fields'], len(owners))):
        city, lat, lng = random.choice(UK_CITIES)
        field_type = random.choice(FIELD_TYPES)
        capacity = {"5v5": 10, "7v7": 14, "11v11": 22}[field_type]
        status = random.choices(
            [FieldStatus.VERIFIED, FieldStatus.PENDING, FieldStatus.REJECTED],
            weights=[70, 20, 10]
        )[0]
        
        street = fake.street_name()
        fields.append({
            'owner_id': owners[i % len(owners)].user_id,
            'field_name': f"{street} Football Complex {field_type}",
            'description': f"High quality {field_type} artificial turf pitch. Located near the center.",
            'location': f"{fake.building_number()} {street}, {city}",
            'latitude': lat + random.uniform(-0.05, 0.05),
            'longitude': lng + random.uniform(-0.05, 0.05),
            'default_price_per_hour': Decimal(random.choice([20, 30, 40, 50])), # More realistic GBP-like prices (though unit is not user-facing here)
            'capacity': capacity,
            'status': status,
            'rejection_reason': fake.sentence() if status == FieldStatus.REJECTED else None,
        })
    return fields


def generate_calendar_slots(fields: List[FieldProfile]) -> List[Dict]:
    """Generate calendar slots for each field."""
    slots = []
    today = date.today()
    hours = [(h, h+1) for h in range(6, 22)]  # 6 AM to 10 PM
    
    for field in fields:
        if field.status != FieldStatus.VERIFIED:
            continue
        for day_offset in range(CONFIG['calendar_days']):
            slot_date = today + timedelta(days=day_offset)
            for start_h, end_h in hours:
                status = random.choices(
                    [CalendarStatus.AVAILABLE, CalendarStatus.BOOKED, CalendarStatus.MAINTENANCE, CalendarStatus.BLOCKED],
                    weights=[70, 20, 5, 5]
                )[0]
                slots.append({
                    'field_id': field.field_id,
                    'date': slot_date,
                    'start_time': time(start_h, 0),
                    'end_time': time(end_h, 0),
                    'status': status,
                })
    return slots


def generate_bookings(fields: List[FieldProfile], teams: List[TeamProfile], users: List[UserAccount]) -> List[Dict]:
    """Generate booking requests."""
    bookings = []
    verified_fields = [f for f in fields if f.status == FieldStatus.VERIFIED]
    verified_teams = [t for t in teams if t.status == TeamStatus.VERIFIED]
    
    if not verified_fields or not verified_teams:
        return bookings
    
    today = date.today()
    for i in range(CONFIG['bookings']):
        field = random.choice(verified_fields)
        team = random.choice(verified_teams)
        book_date = today + timedelta(days=random.randint(-7, 14))
        start_hour = random.randint(6, 20)
        status = random.choices(
            [BookingStatus.CONFIRMED, BookingStatus.PENDING, BookingStatus.CANCELLED, BookingStatus.REJECTED],
            weights=[40, 30, 20, 10]
        )[0]
        
        bookings.append({
            'field_id': field.field_id,
            'team_id': team.team_id,
            'requester_id': team.leader_id,
            'date': book_date,
            'start_time': time(start_hour, 0),
            'end_time': time(start_hour + 1, 0),
            'status': status,
            'notes': fake.sentence() if random.random() > 0.5 else None,
            'processed_at': datetime.utcnow() if status != BookingStatus.PENDING else None,
        })
    return bookings


def generate_matches(teams: List[TeamProfile], fields: List[FieldProfile], bookings: List[BookingRequest]) -> List[Dict]:
    """Generate match events."""
    matches = []
    verified_teams = [t for t in teams if t.status == TeamStatus.VERIFIED]
    verified_fields = [f for f in fields if f.status == FieldStatus.VERIFIED]
    
    if len(verified_teams) < 2:
        # Need at least 2 teams to create matches
        return matches
    
    today = date.today()
    for i in range(CONFIG['matches']):
        host = random.choice(verified_teams)
        # Filter out host from opponents list
        possible_opponents = [t for t in verified_teams if t.team_id != host.team_id]
        if not possible_opponents:
            continue  # Skip if no opponents available
        opponent = random.choice(possible_opponents)
        field = random.choice(verified_fields) if verified_fields else None
        match_date = today + timedelta(days=random.randint(-14, 14))
        start_hour = random.randint(6, 20)
        status = random.choices(
            [MatchStatus.COMPLETED, MatchStatus.SCHEDULED, MatchStatus.PENDING_APPROVAL, MatchStatus.IN_PROGRESS, MatchStatus.CANCELLED],
            weights=[25, 30, 20, 15, 10]
        )[0]
        
        matches.append({
            'host_team_id': host.team_id,
            'opponent_team_id': opponent.team_id,
            'field_id': field.field_id if field else None,
            'match_date': match_date,
            'start_time': time(start_hour, 0),
            'end_time': time(start_hour + 2, 0),
            'status': status,
            'visibility': random.choice(list(Visibility)),
            'description': fake.sentence() if random.random() > 0.5 else None,
        })
    return matches


def generate_posts(users: List[UserAccount], teams: List[TeamProfile]) -> List[Dict]:
    """Generate social posts."""
    posts = []
    for i in range(CONFIG['posts']):
        author = random.choice(users)
        team = random.choice(teams) if random.random() > 0.5 and teams else None
        
        posts.append({
            'author_id': author.user_id,
            'team_id': team.team_id if team else None,
            'content': fake.paragraph(nb_sentences=random.randint(1, 4)),
            'visibility': random.choice(list(Visibility)),
            'reaction_count': random.randint(0, 50),
            'comment_count': random.randint(0, 20),
        })
    return posts


def generate_notifications(users: List[UserAccount]) -> List[Dict]:
    """Generate notifications."""
    notifications = []
    types = list(NotificationType)
    
    for i in range(CONFIG['notifications']):
        user = random.choice(users)
        notif_type = random.choice(types)
        
        notifications.append({
            'user_id': user.user_id,
            'type': notif_type,
            'title': f"Notification: {notif_type.value}",
            'message': fake.sentence(),
            'is_read': random.random() > 0.6,
        })
    return notifications


# ============================================================================
# MAIN SEEDING LOGIC
# ============================================================================
async def seed_database(dry_run: bool = False, clear: bool = False):
    """Main function to seed the database."""
    print(f"🌱 Starting database seeding (dry_run={dry_run}, clear={clear})")
    print(f"   Seed: {SEED} (reproducible)")
    
    async with async_session_factory() as session:
        if clear:
            print("🗑️  Clearing existing data...")
            for table in reversed(Base.metadata.sorted_tables):
                await session.execute(table.delete())
            await session.commit()
            print("   Done clearing.")
        
        # Generate and insert data in order
        print("\n📊 Generating data...")
        
        # 1. Amenities (lookup table)
        print("   - Amenities...")
        amenity_objs = []
        for i, name in enumerate(AMENITIES):
            amenity_objs.append(Amenity(name=name, description=f"{name} facility", icon=name.lower()))
        if not dry_run:
            session.add_all(amenity_objs)
            await session.flush()
        else:
            for i, a in enumerate(amenity_objs, start=1):
                a.amenity_id = i
        print(f"     Created {len(amenity_objs)} amenities")
        
        # 2. Users
        print("   - Users...")
        user_data = generate_users(CONFIG['users'])
        user_objs = [UserAccount(**u) for u in user_data]
        if not dry_run:
            session.add_all(user_objs)
            await session.flush()
        else:
            # Assign temporary IDs for dry-run mode
            for i, u in enumerate(user_objs, start=1):
                u.user_id = i
        print(f"     Created {len(user_objs)} users")
        
        # 3. Players
        print("   - Players...")
        player_data = generate_players(user_objs)
        player_objs = [PlayerProfile(**p) for p in player_data]
        if not dry_run:
            session.add_all(player_objs)
            await session.flush()
        else:
            for i, p in enumerate(player_objs, start=1):
                p.player_id = i
        print(f"     Created {len(player_objs)} players")
        
        # 4. Teams
        print("   - Teams...")
        team_data = generate_teams(user_objs)
        team_objs = [TeamProfile(**t) for t in team_data]
        if not dry_run:
            session.add_all(team_objs)
            await session.flush()
        else:
            for i, t in enumerate(team_objs, start=1):
                t.team_id = i
        print(f"     Created {len(team_objs)} teams")
        
        # 5. Team Wallets
        print("   - Team Wallets...")
        wallet_objs = [TeamWallet(team_id=t.team_id, balance=Decimal(random.randint(0, 5000000))) for t in team_objs]
        if not dry_run:
            session.add_all(wallet_objs)
            await session.flush()
        print(f"     Created {len(wallet_objs)} wallets")
        
        # 6. Team Rosters
        print("   - Team Rosters...")
        roster_objs = []
        for team in team_objs:
            members = random.sample(player_objs, min(random.randint(5, 12), len(player_objs)))
            for j, player in enumerate(members):
                role = RosterRole.CAPTAIN if j == 0 else (RosterRole.VICE_CAPTAIN if j == 1 else RosterRole.MEMBER)
                roster_objs.append(TeamRoster(team_id=team.team_id, player_id=player.player_id, role=role))
        if not dry_run:
            session.add_all(roster_objs)
            await session.flush()
        print(f"     Created {len(roster_objs)} roster entries")
        
        # 7. Fields
        print("   - Fields...")
        field_data = generate_fields(user_objs)
        field_objs = [FieldProfile(**f) for f in field_data]
        if not dry_run:
            session.add_all(field_objs)
            await session.flush()
        else:
            for i, f in enumerate(field_objs, start=1):
                f.field_id = i
        print(f"     Created {len(field_objs)} fields")
        
        # 8. Field Calendar Slots
        print("   - Calendar Slots...")
        slot_data = generate_calendar_slots(field_objs)
        slot_objs = [FieldCalendar(**s) for s in slot_data]
        if not dry_run:
            session.add_all(slot_objs)
            await session.flush()
        print(f"     Created {len(slot_objs)} calendar slots")
        
        # 9. Field Amenities
        print("   - Field Amenities...")
        field_amenity_objs = []
        for field in field_objs:
            selected = random.sample(amenity_objs, random.randint(3, 7))
            for amenity in selected:
                field_amenity_objs.append(FieldAmenity(field_id=field.field_id, amenity_id=amenity.amenity_id))
        if not dry_run:
            session.add_all(field_amenity_objs)
            await session.flush()
        print(f"     Created {len(field_amenity_objs)} field amenities")
        
        # 10. Bookings
        print("   - Bookings...")
        booking_data = generate_bookings(field_objs, team_objs, user_objs)
        booking_objs = [BookingRequest(**b) for b in booking_data]
        if not dry_run:
            session.add_all(booking_objs)
            await session.flush()
        print(f"     Created {len(booking_objs)} bookings")
        
        # 11. Matches
        print("   - Matches...")
        match_data = generate_matches(team_objs, field_objs, booking_objs)
        match_objs = [MatchEvent(**m) for m in match_data]
        if not dry_run:
            session.add_all(match_objs)
            await session.flush()
        else:
            for i, m in enumerate(match_objs, start=1):
                m.match_id = i
        print(f"     Created {len(match_objs)} matches")
        
        # 12. Match Results (for completed matches)
        print("   - Match Results...")
        result_objs = []
        completed_matches = [m for m in match_objs if m.status == MatchStatus.COMPLETED]
        for match in completed_matches:
            home_score = random.randint(0, 5)
            away_score = random.randint(0, 5)
            winner = match.host_team_id if home_score > away_score else (match.opponent_team_id if away_score > home_score else None)
            result_objs.append(MatchResult(
                match_id=match.match_id,
                home_score=home_score,
                away_score=away_score,
                winner_id=winner,
                recorded_by=match.host_team_id,
            ))
        if not dry_run:
            session.add_all(result_objs)
            await session.flush()
        print(f"     Created {len(result_objs)} match results")
        
        # 13. Posts
        print("   - Posts...")
        post_data = generate_posts(user_objs, team_objs)
        post_objs = [Post(**p) for p in post_data]
        if not dry_run:
            session.add_all(post_objs)
            await session.flush()
        else:
            for i, p in enumerate(post_objs, start=1):
                p.post_id = i
        print(f"     Created {len(post_objs)} posts")
        
        # 14. Comments
        print("   - Comments...")
        comment_objs = []
        for i in range(CONFIG['comments']):
            post = random.choice(post_objs)
            author = random.choice(user_objs)
            comment_objs.append(Comment(post_id=post.post_id, author_id=author.user_id, content=fake.sentence()))
        if not dry_run:
            session.add_all(comment_objs)
            await session.flush()
        else:
            for i, c in enumerate(comment_objs, start=1):
                c.comment_id = i
        print(f"     Created {len(comment_objs)} comments")
        
        # 15. Reactions
        print("   - Reactions...")
        reaction_objs = []
        for i in range(CONFIG['reactions']):
            user = random.choice(user_objs)
            entity_type = random.choice(list(ReactionEntityType))
            entity_id = random.choice(post_objs).post_id if entity_type == ReactionEntityType.POST else random.choice(comment_objs).comment_id
            reaction_objs.append(Reaction(
                entity_type=entity_type,
                entity_id=entity_id,
                user_id=user.user_id,
                type=random.choice(list(ReactionType)),
            ))
        if not dry_run:
            session.add_all(reaction_objs)
            await session.flush()
        print(f"     Created {len(reaction_objs)} reactions")
        
        # 16. Notifications
        print("   - Notifications...")
        notif_data = generate_notifications(user_objs)
        notif_objs = [Notification(**n) for n in notif_data]
        if not dry_run:
            session.add_all(notif_objs)
            await session.flush()
        print(f"     Created {len(notif_objs)} notifications")
        
        # 17. Reports
        print("   - Reports...")
        report_objs = []
        for i in range(CONFIG['reports']):
            reporter = random.choice(user_objs)
            reported = random.choice([u for u in user_objs if u.user_id != reporter.user_id])
            report_objs.append(Report(
                reporter_id=reporter.user_id,
                reported_user_id=reported.user_id,
                content_type=random.choice(list(ReportContentType)),
                reason=random.choice(["Spam", "Harassment", "Inappropriate content", "Fake account"]),
                details=fake.sentence(),
                status=random.choice(list(ReportStatus)),
            ))
        if not dry_run:
            session.add_all(report_objs)
            await session.flush()
        print(f"     Created {len(report_objs)} reports")
        
        if not dry_run:
            await session.commit()
            print("\n✅ Database seeding complete!")
        else:
            print("\n🔍 Dry run complete - no data was inserted.")
    
    # Properly dispose engine to avoid aiomysql cleanup warnings
    await engine.dispose()


async def verify_database():
    """Count records in all tables."""
    print("📋 Verifying database contents...\n")
    
    from sqlalchemy import select, func
    
    async with async_session_factory() as session:
        tables = [
            ("UserAccount", UserAccount),
            ("PlayerProfile", PlayerProfile),
            ("TeamProfile", TeamProfile),
            ("TeamWallet", TeamWallet),
            ("TeamRoster", TeamRoster),
            ("FieldProfile", FieldProfile),
            ("FieldCalendar", FieldCalendar),
            ("Amenity", Amenity),
            ("FieldAmenity", FieldAmenity),
            ("BookingRequest", BookingRequest),
            ("MatchEvent", MatchEvent),
            ("MatchResult", MatchResult),
            ("Post", Post),
            ("Comment", Comment),
            ("Reaction", Reaction),
            ("Notification", Notification),
            ("Report", Report),
        ]
        
        total = 0
        for name, model in tables:
            result = await session.execute(select(func.count()).select_from(model))
            count = result.scalar()
            total += count
            print(f"   {name:20s}: {count:6d} records")
        
        print(f"\n   {'TOTAL':20s}: {total:6d} records")
    
    # Properly dispose engine to avoid aiomysql cleanup warnings
    await engine.dispose()


def main():
    parser = argparse.ArgumentParser(description="Seed the database with mock data")
    parser.add_argument("--dry-run", action="store_true", help="Preview without inserting")
    parser.add_argument("--verify", action="store_true", help="Count records in tables")
    parser.add_argument("--clear", action="store_true", help="Clear existing data first")
    args = parser.parse_args()
    
    if args.verify:
        asyncio.run(verify_database())
    else:
        asyncio.run(seed_database(dry_run=args.dry_run, clear=args.clear))


if __name__ == "__main__":
    main()
