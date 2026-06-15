from fastapi import FastAPI
import argparse

from .core import add

app = FastAPI(title="Rasta Imperium API")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/add")
def add_api(a: int, b: int):
    return {"result": add(a, b)}


def main():
    parser = argparse.ArgumentParser(description="Rasta Imperium CLI")
    parser.add_argument("--a", type=int)
    parser.add_argument("--b", type=int)
    args = parser.parse_args()

    if args.a is not None and args.b is not None:
        print(add(args.a, args.b))
    else:
        print("Provide --a and --b")


if __name__ == "__main__":
    main()
