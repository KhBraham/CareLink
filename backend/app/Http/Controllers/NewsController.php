<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class NewsController extends Controller
{
    private $newsApiKey = '018977abb25348cbbbc908ba0df0b046';
    private $newsApiBaseUrl = 'https://newsapi.org/v2';

    public function getHealthNews()
    {
        try {
            $response = Http::withoutVerifying()->get($this->newsApiBaseUrl . '/top-headlines', [
                'country' => 'us',
                'category' => 'health',
                'apiKey' => $this->newsApiKey
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch news',
                'error' => $response->json()
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch news',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
