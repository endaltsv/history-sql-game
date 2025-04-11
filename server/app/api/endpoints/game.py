from fastapi import APIRouter, HTTPException, Request, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text, Integer, String, Date, Time, Text
from sqlalchemy.exc import SQLAlchemyError
from typing import Dict, Any, List
import logging
from datetime import datetime
from app.db.session import get_db
from app.models.game import CampLog, Finances, MovementRecord, SecretNegotiation

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["game"])

@router.get("/case/{case_id}/data")
def get_case_data(case_id: str, db: Session = Depends(get_db)):
    if case_id == 'case-001':
        return {
            "tableName": "camp_logs",
            "title": "Журнал патрулирования (camp_logs)",
            "data": [log.__dict__ for log in db.query(CampLog).all()]
        }
    elif case_id == 'case-002':
        return {
            "tables": [
                {
                    "tableName": "camp_logs",
                    "title": "Журнал патрулирования (camp_logs)",
                    "data": [log.__dict__ for log in db.query(CampLog).all()]
                }
            ]
        }
    elif case_id == 'case-003':
        return {
            "tableName": "finances",
            "title": "Финансовые операции (finances)",
            "data": [finance.__dict__ for finance in db.query(Finances).all()]
        }
    elif case_id == 'case-004':
        return {
            "tables": [
                {
                    "tableName": "camp_logs",
                    "title": "Журнал патрулирования (camp_logs)",
                    "data": [log.__dict__ for log in db.query(CampLog).all()]
                },
                {
                    "tableName": "finances",
                    "title": "Финансовые операции (finances)",
                    "data": [finance.__dict__ for finance in db.query(Finances).all()]
                }
            ]
        }
    elif case_id == 'case-005':
        return {
            "tableName": "movement_records",
            "title": "Записи о перемещениях (movement_records)",
            "data": [move.__dict__ for move in db.query(MovementRecord).all()]
        }
    elif case_id == 'case-006':
        return {
            "tables": [
                {
                    "tableName": "secret_negotiations",
                    "title": "Тайные переговоры (secret_negotiations)",
                    "data": [neg.__dict__ for neg in db.query(SecretNegotiation).all()]
                },
                {
                    "tableName": "finances",
                    "title": "Финансовые операции (finances)",
                    "data": [finance.__dict__ for finance in db.query(Finances).all()]
                }
            ]
        }
    else:
        raise HTTPException(status_code=404, detail="Кейс не найден")

@router.post("/execute-sql")
async def execute_sql(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        query = data.get("query", "").strip()
        case_id = data.get("caseId")
        user_id = data.get("userId")  # Добавляем user_id из запроса

        logger.info(f"Received SQL query: {query}")
        logger.info(f"Case ID: {case_id}")
        logger.info(f"User ID: {user_id}")

        if not query:
            raise HTTPException(status_code=400, detail="Query cannot be empty")

        if not query.upper().lstrip().startswith("SELECT"):
            raise HTTPException(status_code=400, detail="Only SELECT queries are allowed")

        forbidden_keywords = ["DROP", "TRUNCATE", "ALTER", "CREATE", "DELETE", "INSERT", "UPDATE"]
        if any(keyword in query.upper() for keyword in forbidden_keywords):
            raise HTTPException(status_code=403, detail="This operation is not allowed")

        try:
            if query.count('(') != query.count(')'):
                raise HTTPException(status_code=400, detail="Unbalanced parentheses in query")

            common_errors = [
                ('FROM FROM', 'Duplicate FROM clause'),
                ('WHERE WHERE', 'Duplicate WHERE clause'),
                ('SELECT SELECT', 'Duplicate SELECT keyword'),
                ('GROUP GROUP', 'Duplicate GROUP BY clause'),
                ('ORDER ORDER', 'Duplicate ORDER BY clause')
            ]
            
            query_upper = query.upper()
            for error_pattern, error_message in common_errors:
                if error_pattern in query_upper:
                    logger.warning(f"Found error pattern: {error_pattern}")
                    raise HTTPException(status_code=400, detail=error_message)

            # Выполняем запрос пользователя
            result = db.execute(text(query))
            columns = result.keys()
            rows = []
            for row in result:
                row_dict = {}
                for i, column in enumerate(columns):
                    row_dict[column] = row[i]
                rows.append(row_dict)
            
            user_result = {
                "columns": list(columns),
                "rows": rows
            }

            logger.info(f"Query executed successfully. Columns: {columns}")
            # TODO: Не оптимизировано вообще, нужно переделать
            # Если указан case_id, проверяем правильность решения
            is_correct = False
            if case_id:
                try:
                    # Получаем эталонный результат
                    if case_id == "case-001":
                        reference_query = """
                            SELECT * 
                            FROM camp_logs 
                            WHERE date = '1380-09-06' 
                            AND shift = 'night';
                        """
                    elif case_id == "case-002":
                        reference_query = """
                            SELECT * 
                            FROM camp_logs 
                            WHERE action = 'exit' 
                            AND date = '1380-09-07';
                        """
                    elif case_id == "case-003":
                        reference_query = """
                            SELECT recipient_name, amount 
                            FROM finances 
                            WHERE transaction_date = '1380-09-06' 
                            AND amount > 50;
                        """
                    elif case_id == "case-004":
                        reference_query = """
                            SELECT c.guard_name, c.date, c.time, f.amount 
                            FROM camp_logs c 
                            JOIN finances f 
                              ON c.guard_name = f.recipient_name 
                            WHERE c.date = '1380-09-07' 
                              AND c.time > '00:00:00' 
                              AND f.transaction_date = '1380-09-06' 
                              AND f.amount > 50 
                              AND c.action = 'exit';
                        """
                    elif case_id == "case-005":
                        reference_query = """
                            SELECT main_person, companion, notes 
                            FROM movement_records 
                            WHERE date = '1380-09-07' 
                              AND (route = 'Река' OR notes LIKE '%брод%');
                        """
                    elif case_id == "case-006":
                        reference_query = """
                            SELECT sn.person_name, sn.date, f.amount, sn.details 
                            FROM secret_negotiations sn 
                            JOIN finances f 
                              ON sn.person_name = f.recipient_name 
                            WHERE f.amount > 50 
                              AND sn.date = f.transaction_date 
                              AND sn.contact_type IS NOT NULL 
                              AND sn.contact_type <> 'none';
                        """
                    else:
                        raise HTTPException(status_code=404, detail="Кейс не найден")
                    
                    ref_result = db.execute(text(reference_query))
                    ref_columns = ref_result.keys()
                    ref_rows = []
                    for row in ref_result:
                        row_dict = {}
                        for i, column in enumerate(ref_columns):
                            row_dict[column] = row[i]
                        ref_rows.append(row_dict)
                    reference_result = {
                        "columns": list(ref_columns),
                        "rows": ref_rows
                    }
                    
                    is_correct = compare_results(user_result, reference_result)
                    logger.info(f"Case {case_id} check result: {is_correct}")

                    # Обновляем прогресс квеста, если указан user_id
                    if user_id and is_correct:
                        update_quest_progress(user_id, case_id, True, db)

                except SQLAlchemyError as e:
                    logger.error(f"Error executing reference query: {str(e)}")
                    raise HTTPException(status_code=500, detail=f"Ошибка при выполнении эталонного запроса: {str(e)}")

            return {
                **user_result,
                "isCorrect": is_correct if case_id else None,
                "message": "Поздравляем! Вы нашли правильное решение!" if is_correct else None
            }

        except SQLAlchemyError as e:
            error_message = str(e)
            logger.error(f"SQL Error: {error_message}")
            if "no such column" in error_message.lower():
                raise HTTPException(status_code=400, detail="Invalid column name in query")
            elif "no such table" in error_message.lower():
                raise HTTPException(status_code=400, detail="Invalid table name in query")
            elif "syntax error" in error_message.lower():
                raise HTTPException(status_code=400, detail="SQL syntax error")
            else:
                raise HTTPException(status_code=400, detail=error_message)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/case/{case_id}/schema")
def get_case_schema(case_id: str):
    def get_table_schema(model):
        columns = []
        for column in model.__table__.columns:
            column_type = str(column.type)
            if isinstance(column.type, Integer):
                column_type = "INTEGER"
            elif isinstance(column.type, String):
                column_type = f"VARCHAR({column.type.length})"
            elif isinstance(column.type, Date):
                column_type = "DATE"
            elif isinstance(column.type, Time):
                column_type = "TIME"
            elif isinstance(column.type, Text):
                column_type = "TEXT"
            
            columns.append({
                "name": column.name,
                "type": column_type,
                "isPrimary": column.primary_key,
                "isNullable": column.nullable
            })
        return {
            "tableName": model.__tablename__,
            "title": f"Схема таблицы {model.__tablename__}",
            "columns": columns
        }

    if case_id == 'case-001':
        return get_table_schema(CampLog)
    elif case_id == 'case-002':
        return get_table_schema(CampLog)
    elif case_id == 'case-003':
        return get_table_schema(Finances)
    elif case_id == 'case-004':
        return {
            "tables": [
                get_table_schema(CampLog),
                get_table_schema(Finances)
            ]
        }
    elif case_id == 'case-005':
        return get_table_schema(MovementRecord)
    elif case_id == 'case-006':
        return {
            "tables": [
                get_table_schema(SecretNegotiation),
                get_table_schema(Finances)
            ]
        }
    else:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")

def compare_results(user_result: Dict[str, Any], reference_result: Dict[str, Any]) -> bool:
    """Сравнивает результаты запросов пользователя и эталонного"""
    if set(user_result["columns"]) != set(reference_result["columns"]):
        return False
    
    # Сортируем строки по всем колонкам для сравнения
    user_rows = sorted([tuple(row[col] for col in sorted(user_result["columns"])) 
                       for row in user_result["rows"]])
    ref_rows = sorted([tuple(row[col] for col in sorted(reference_result["columns"])) 
                      for row in reference_result["rows"]])
    
    return user_rows == ref_rows 

