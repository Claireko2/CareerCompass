from fastapi import FastAPI
from pydantic import BaseModel
import spacy
from spacy.matcher import PhraseMatcher
import json, pathlib

app = FastAPI()
nlp = spacy.load("en_core_web_sm", disable=["ner", "parser"])  # fast!
matcher = PhraseMatcher(nlp.vocab, attr="LOWER")

# Load { alias → skill_id } built during ETL of ESCO
alias2id = json.loads(pathlib.Path("skill_alias_map.json").read_text())
patterns = [nlp.make_doc(alias) for alias in alias2id.keys()]
matcher.add("SKILLS", patterns)

class In(BaseModel):
    text: str

@app.post("/extract")
def extract(payload: In):
    doc = nlp(payload.text)
    skill_ids = { alias2id[m.text.lower()] for m in matcher(doc) }
    return {"skill_ids": list(skill_ids)}
