from sqlalchemy import Column, Integer, String, Date, Time, Text, Boolean
from app.db.base import Base

class CampLog(Base):
    __tablename__ = "camp_logs"
    
    log_id = Column(Integer, primary_key=True, index=True)
    guard_name = Column(String(100))
    date = Column(Date)
    shift = Column(String(50))
    action = Column(String(50))
    time = Column(Time)
    notes = Column(Text)

class Finances(Base):
    __tablename__ = "finances"
    
    trans_id = Column(Integer, primary_key=True, index=True)
    recipient_name = Column(String(100))
    amount = Column(Integer)
    transaction_date = Column(Date)

class MovementRecord(Base):
    __tablename__ = "movement_records"
    
    move_id = Column(Integer, primary_key=True, index=True)
    main_person = Column(String(100))
    companion = Column(String(100))
    route = Column(String(100))
    date = Column(Date)
    notes = Column(Text)

class SecretNegotiation(Base):
    __tablename__ = "secret_negotiations"
    
    neg_id = Column(Integer, primary_key=True, index=True)
    person_name = Column(String(100))
    contact_type = Column(String(50))
    date = Column(Date)
    details = Column(Text)
