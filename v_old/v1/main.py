from src.process import process_item


def main():
    obj = {
        "tipo": "use_activated",
        "liv_spell": 3,
        "liv_caster": 5,
        "mods": [
            {"tipo": "daily_charges", "n": 1},
            {"tipo": "slot", "t_slot": 'correct'}
        ]
    }
    process_item(obj)


if __name__ == "__main__":
    main()
