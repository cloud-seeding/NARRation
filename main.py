from typing import List

import pandas as pd
import uvicorn
from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


df = pd.read_csv('weather_outliers.csv')
df['fire_id_2'] = pd.to_datetime(df['fire_id_2'])


@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/data-range")
async def get_data_range():
    """Get the range of values for sliders"""
    return {
        "level_range": {
            "min": float(df['level'].min()),
            "max": float(df['level'].max())
        },
        "date_range": {
            "min": df['fire_id_2'].min().isoformat(),
            "max": df['fire_id_2'].max().isoformat()
        },
        "lat_range": {
            "min": float(df['x'].min()),
            "max": float(df['x'].max())
        },
        "lon_range": {
            "min": float(df['y'].min()),
            "max": float(df['y'].max())
        }
    }


@app.get("/weather-data")
async def get_weather_data(
    min_level: float = Query(...),
    max_level: float = Query(...),
    start_date: str = Query(...),
    end_date: str = Query(...),
    min_lat: float = Query(...),
    max_lat: float = Query(...),
    min_lon: float = Query(...),
    max_lon: float = Query(...),
    variables: List[str] = Query(...)
):
    """Get filtered weather data based on slider values"""

    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date)

    mask = (
        (df['level'] >= min_level) &
        (df['level'] <= max_level) &
        (df['fire_id_2'] >= start_date) &
        (df['fire_id_2'] <= end_date) &
        (df['x'] >= min_lat) &
        (df['x'] <= max_lat) &
        (df['y'] >= min_lon) &
        (df['y'] <= max_lon)
    )

    filtered_df = df[mask]

    if len(filtered_df) > 10000:
        filtered_df = filtered_df.sample(n=10000)

    columns_to_return = ['x', 'y'] + variables + ['is_outlier']

    return filtered_df[columns_to_return].to_dict(orient='records')

if __name__ == "__main__":
    uvicorn.run(app, port=8000)
