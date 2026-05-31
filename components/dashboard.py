import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# ============================================
# PAGE CONFIGURATION
# ============================================
st.set_page_config(
    page_title="Kundalini Activity Dashboard",
    page_icon="🧘",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ============================================
# CUSTOM CSS STYLING
# ============================================
st.markdown("""
<style>
    /* Main header gradient */
    .main-header {
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(120deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        padding: 1rem 0;
    }
    
    /* Subheader styling */
    .section-header {
        color: #1e3a5f;
        border-left: 4px solid #f5576c;
        padding-left: 12px;
        margin: 1.5rem 0 1rem 0;
    }
    
    /* Card container */
    .metric-container {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        padding: 1.2rem;
        color: white;
        text-align: center;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    /* Upload area styling */
    .upload-container {
        border: 2px dashed #667eea;
        border-radius: 15px;
        padding: 2rem;
        text-align: center;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        margin: 2rem 0;
    }
    
    /* Chakra badge */
    .chakra-badge {
        display: inline-block;
        padding: 0.4rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        margin: 0.2rem;
    }
    
    /* Info box */
    .info-box {
        background: #e8f4f8;
        border-left: 4px solid #17a2b8;
        padding: 1rem;
        border-radius: 0 8px 8px 0;
        margin: 1rem 0;
    }
    
    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    
    /* Improve dataframe appearance */
    .stDataFrame {
        border-radius: 10px;
        overflow: hidden;
    }
</style>
""", unsafe_allow_html=True)

# ============================================
# CHAKRA COLOR MAPPING
# ============================================
CHAKRA_COLORS = {
    "Root": "#E53935",
    "Sacral": "#FF7043",
    "Solar Plexus": "#FDD835",
    "Heart": "#4CAF50",
    "Throat": "#29B6F6",
    "Third Eye": "#5C6BC0",
    "Crown": "#AB47BC"
}

CHAKRA_EMOJIS = {
    "Root": "🔴",
    "Sacral": "🟠",
    "Solar Plexus": "🟡",
    "Heart": "💚",
    "Throat": "🔵",
    "Third Eye": "🟣",
    "Crown": "👑"
}

def get_chakra_color(chakra_name):
    """Return color for chakra, with fallback"""
    return CHAKRA_COLORS.get(chakra_name, "#667eea")

def get_chakra_emoji(chakra_name):
    """Return emoji for chakra, with fallback"""
    return CHAKRA_EMOJIS.get(chakra_name, "✨")

# ============================================
# SIDEBAR
# ============================================
with st.sidebar:
    st.markdown("## 🧘 Navigation")
    st.markdown("---")
    
    # File uploader in sidebar
    st.markdown("### 📁 Upload Data")
    file = st.file_uploader(
        "Choose your CSV file",
        type=["csv"],
        help="Upload a CSV file containing your Kundalini activity data"
    )
    
    st.markdown("---")
    
    # Sidebar info
    with st.expander("ℹ️ About This Dashboard"):
        st.markdown("""
        Track and visualize your **Kundalini energy** 
        flow across all seven chakras.
        
        **Features:**
        - 📊 Data visualization
        - 🔮 Chakra analysis
        - 📈 Statistical insights
        - ⬇️ Export capabilities
        """)
    
    # Chakra legend
    with st.expander("🌈 Chakra Colors"):
        for chakra, color in CHAKRA_COLORS.items():
            emoji = get_chakra_emoji(chakra)
            st.markdown(
                f'<span style="color:{color}; font-weight:600;">{emoji} {chakra}</span>',
                unsafe_allow_html=True
            )

# ============================================
# MAIN HEADER
# ============================================
st.markdown('<h1 class="main-header">🧘 Kundalini Activity Dashboard</h1>', unsafe_allow_html=True)

# ============================================
# MAIN CONTENT
# ============================================
if file is not None:
    # Load data with loading spinner
    with st.spinner("Loading your spiritual data..."):
        df = pd.read_csv(file)
    
    # Success notification
    st.success(f"✅ Successfully loaded **{len(df):,}** records from your file!")
    
    # ----------------------------------------
    # KEY METRICS ROW
    # ----------------------------------------
    st.markdown('<h3 class="section-header">📊 Quick Overview</h3>', unsafe_allow_html=True)
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="📋 Total Records",
            value=f"{len(df):,}",
            help="Total number of entries in your dataset"
        )
    
    with col2:
        st.metric(
            label="📑 Columns",
            value=len(df.columns),
            help="Number of data columns"
        )
    
    with col3:
        if "Chakra" in df.columns:
            st.metric(
                label="🔮 Unique Chakras",
                value=df["Chakra"].nunique(),
                help="Number of different chakras tracked"
            )
        else:
            st.metric(label="🔮 Chakras", value="N/A")
    
    with col4:
        numeric_cols = df.select_dtypes(include=['number']).columns
        if len(numeric_cols) > 0:
            avg_val = df[numeric_cols[0]].mean()
            st.metric(
                label=f"📈 Avg {numeric_cols[0][:10]}",
                value=f"{avg_val:.1f}",
                help=f"Average value of {numeric_cols[0]}"
            )
        else:
            st.metric(label="📈 Numeric Cols", value="0")
    
    st.markdown("---")
    
    # ----------------------------------------
    # TABBED INTERFACE
    # ----------------------------------------
    tab1, tab2, tab3 = st.tabs([
        "📋 Data Explorer",
        "📊 Analytics",
        "🔮 Chakra Analysis"
    ])
    
    # ================== TAB 1: DATA EXPLORER ==================
    with tab1:
        st.markdown('<h3 class="section-header">📋 Data Explorer</h3>', unsafe_allow_html=True)
        
        # Filter controls in expander
        with st.expander("🔧 Display Options", expanded=False):
            col1, col2 = st.columns(2)
            
            with col1:
                columns_to_display = st.multiselect(
                    "Select columns to show",
                    options=df.columns.tolist(),
                    default=df.columns.tolist(),
                    help="Choose which columns to display"
                )
            
            with col2:
                num_rows = st.slider(
                    "Number of rows to display",
                    min_value=5,
                    max_value=min(100, len(df)),
                    value=min(20, len(df)),
                    help="Adjust how many rows to show"
                )
        
        # Display dataframe
        if columns_to_display:
            st.dataframe(
                df[columns_to_display].head(num_rows),
                use_container_width=True,
                height=400
            )
        else:
            st.warning("Please select at least one column to display.")
        
        # Download section
        st.markdown("---")
        col1, col2, col3 = st.columns([1, 1, 2])
        
        with col1:
            csv_data = df.to_csv(index=False).encode('utf-8')
            st.download_button(
                label="⬇️ Download CSV",
                data=csv_data,
                file_name="kundalini_data.csv",
                mime="text/csv",
                use_container_width=True
            )
        
        with col2:
            json_data = df.to_json(orient='records')
            st.download_button(
                label="⬇️ Download JSON",
                data=json_data,
                file_name="kundalini_data.json",
                mime="application/json",
                use_container_width=True
            )
    
    # ================== TAB 2: ANALYTICS ==================
    with tab2:
        st.markdown('<h3 class="section-header">📊 Statistical Analysis</h3>', unsafe_allow_html=True)
        
        col1, col2 = st.columns([1, 1])
        
        with col1:
            st.markdown("#### 📈 Numerical Summary")
            numeric_df = df.describe()
            st.dataframe(numeric_df, use_container_width=True)
        
        with col2:
            st.markdown("#### 📋 Data Types")
            dtype_df = pd.DataFrame({
                'Column': df.columns,
                'Type': df.dtypes.astype(str),
                'Non-Null': df.count().values,
                'Null': df.isnull().sum().values
            })
            st.dataframe(dtype_df, use_container_width=True, hide_index=True)
        
        # Visualization section
        st.markdown("---")
        st.markdown("#### 📊 Data Visualization")
        
        numeric_columns = df.select_dtypes(include=['number']).columns.tolist()
        
        if numeric_columns:
            col1, col2 = st.columns([1, 2])
            
            with col1:
                chart_type = st.selectbox(
                    "Chart Type",
                    ["Histogram", "Box Plot", "Violin Plot"],
                    help="Select visualization type"
                )
                
                selected_column = st.selectbox(
                    "Select Column",
                    numeric_columns,
                    help="Choose a numeric column to visualize"
                )
                
                color_by_chakra = False
                if "Chakra" in df.columns:
                    color_by_chakra = st.checkbox(
                        "Color by Chakra",
                        value=True,
                        help="Apply chakra colors to chart"
                    )
            
            with col2:
                # Create chart based on selection
                if chart_type == "Histogram":
                    if color_by_chakra and "Chakra" in df.columns:
                        fig = px.histogram(
                            df, x=selected_column, color="Chakra",
                            color_discrete_map=CHAKRA_COLORS,
                            title=f"Distribution of {selected_column}",
                            template="plotly_white"
                        )
                    else:
                        fig = px.histogram(
                            df, x=selected_column,
                            title=f"Distribution of {selected_column}",
                            template="plotly_white",
                            color_discrete_sequence=["#667eea"]
                        )
                
                elif chart_type == "Box Plot":
                    if color_by_chakra and "Chakra" in df.columns:
                        fig = px.box(
                            df, x="Chakra", y=selected_column,
                            color="Chakra",
                            color_discrete_map=CHAKRA_COLORS,
                            title=f"{selected_column} by Chakra",
                            template="plotly_white"
                        )
                    else:
                        fig = px.box(
                            df, y=selected_column,
                            title=f"Box Plot of {selected_column}",
                            template="plotly_white",
                            color_discrete_sequence=["#667eea"]
                        )
                
                else:  # Violin Plot
                    if color_by_chakra and "Chakra" in df.columns:
                        fig = px.violin(
                            df, x="Chakra", y=selected_column,
                            color="Chakra",
                            color_discrete_map=CHAKRA_COLORS,
                            title=f"{selected_column} Distribution by Chakra",
                            template="plotly_white"
                        )
                    else:
                        fig = px.violin(
                            df, y=selected_column,
                            title=f"Violin Plot of {selected_column}",
                            template="plotly_white",
                            color_discrete_sequence=["#667eea"]
                        )
                
                fig.update_layout(
                    height=400,
                    margin=dict(l=20, r=20, t=40, b=20)
                )
                st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("📊 No numeric columns available for visualization.")
    
    # ================== TAB 3: CHAKRA ANALYSIS ==================
    with tab3:
        if "Chakra" in df.columns:
            st.markdown('<h3 class="section-header">🔮 Chakra Analysis</h3>', unsafe_allow_html=True)
            
            # Chakra selector
            col1, col2 = st.columns([1, 2])
            
            with col1:
                chakras = df["Chakra"].unique().tolist()
                selected_chakra = st.selectbox(
                    "🎯 Select Chakra",
                    options=["All Chakras"] + chakras,
                    help="Filter data by specific chakra"
                )
                
                # Chakra distribution pie chart
                st.markdown("#### 📊 Chakra Distribution")
                chakra_counts = df["Chakra"].value_counts().reset_index()
                chakra_counts.columns = ["Chakra", "Count"]
                
                fig_pie = px.pie(
                    chakra_counts,
                    values="Count",
                    names="Chakra",
                    color="Chakra",
                    color_discrete_map=CHAKRA_COLORS,
                    hole=0.4
                )
                fig_pie.update_layout(
                    height=350,
                    margin=dict(l=20, r=20, t=20, b=20),
                    showlegend=True,
                    legend=dict(orientation="h", yanchor="bottom", y=-0.2)
                )
                st.plotly_chart(fig_pie, use_container_width=True)
            
            with col2:
                # Display filtered data
                if selected_chakra == "All Chakras":
                    display_df = df
                    st.markdown("#### 📋 All Chakra Data")
                else:
                    display_df = df[df["Chakra"] == selected_chakra]
                    chakra_color = get_chakra_color(selected_chakra)
                    chakra_emoji = get_chakra_emoji(selected_chakra)
                    
                    # Styled chakra header
                    st.markdown(f"""
                    <div style="
                        background: linear-gradient(135deg, {chakra_color}20 0%, {chakra_color}40 100%);
                        border-left: 5px solid {chakra_color};
                        border-radius: 0 10px 10px 0;
                        padding: 1rem 1.5rem;
                        margin-bottom: 1rem;
                    ">
                        <h3 style="color: {chakra_color}; margin: 0;">
                            {chakra_emoji} {selected_chakra} Chakra
                        </h3>
                        <p style="margin: 0.5rem 0 0 0; color: #555;">
                            <strong>{len(display_df):,}</strong> records found
                        </p>
                    </div>
                    """, unsafe_allow_html=True)
                
                st.dataframe(
                    display_df,
                    use_container_width=True,
                    height=350
                )
                
                # Download filtered data
                csv_filtered = display_df.to_csv(index=False).encode('utf-8')
                filename = f"kundalini_{selected_chakra.lower().replace(' ', '_')}.csv"
                st.download_button(
                    label=f"⬇️ Download {selected_chakra} Data",
                    data=csv_filtered,
                    file_name=filename,
                    mime="text/csv",
                    key="chakra_download"
                )
            
            # Chakra comparison bar chart
            st.markdown("---")
            st.markdown("#### 📊 Chakra Comparison")
            
            # Bar chart of chakra counts
            fig_bar = px.bar(
                chakra_counts,
                x="Chakra",
                y="Count",
                color="Chakra",
                color_discrete_map=CHAKRA_COLORS,
                title="Records per Chakra",
                template="plotly_white"
            )
            fig_bar.update_layout(
                height=300,
                showlegend=False,
                xaxis_title="",
                yaxis_title="Number of Records"
            )
            st.plotly_chart(fig_bar, use_container_width=True)
            
        else:
            # No Chakra column warning
            st.markdown('<h3 class="section-header">🔮 Chakra Analysis</h3>', unsafe_allow_html=True)
            
            st.warning("⚠️ The uploaded file does not contain a 'Chakra' column.")
            
            st.markdown("""
            <div class="info-box">
                <h4>💡 To Enable Chakra Analysis</h4>
                <p>Add a <strong>'Chakra'</strong> column to your CSV with values like:</p>
                <ul>
                    <li>🔴 Root</li>
                    <li>🟠 Sacral</li>
                    <li>🟡 Solar Plexus</li>
                    <li>💚 Heart</li>
                    <li>🔵 Throat</li>
                    <li>🟣 Third Eye</li>
                    <li>👑 Crown</li>
                </ul>
            </div>
            """, unsafe_allow_html=True)

else:
    # ----------------------------------------
    # EMPTY STATE - NO FILE UPLOADED
    # ----------------------------------------
    st.markdown("""
    <div class="upload-container">
        <h2>🙏 Welcome, Seeker</h2>
        <p style="font-size: 1.1rem; color: #555;">
            Upload your CSV file to begin exploring your Kundalini energy patterns
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Getting started guide
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 🚀 Getting Started")
        st.markdown("""
        1. **Upload** your CSV file using the sidebar
        2. **Explore** your data in the Data Explorer tab
        3. **Analyze** patterns in the Analytics tab
        4. **Discover** chakra insights in Chakra Analysis
        """)
    
    with col2:
        st.markdown("### 📄 Sample CSV Format")
        sample_data = pd.DataFrame({
            "Date": ["2024-01-01", "2024-01-02", "2024-01-03"],
            "Chakra": ["Root", "Heart", "Crown"],
            "Energy_Level": [7, 9, 8],
            "Duration_Min": [30, 45, 25],
            "Notes": ["Morning session", "Deep meditation", "Evening practice"]
        })
        st.dataframe(sample_data, use_container_width=True, hide_index=True)
    
    # Chakra info cards
    st.markdown("---")
    st.markdown("### 🌈 The Seven Chakras")
    
    chakra_cols = st.columns(7)
    chakra_info = [
        ("Root", "🔴", "Grounding"),
        ("Sacral", "🟠", "Creativity"),
        ("Solar Plexus", "🟡", "Power"),
        ("Heart", "💚", "Love"),
        ("Throat", "🔵", "Expression"),
        ("Third Eye", "🟣", "Intuition"),
        ("Crown", "👑", "Wisdom")
    ]
    
    for col, (name, emoji, trait) in zip(chakra_cols, chakra_info):
        with col:
            color = get_chakra_color(name)
            st.markdown(f"""
            <div style="
                background: {color}20;
                border: 2px solid {color};
                border-radius: 10px;
                padding: 0.8rem;
                text-align: center;
            ">
                <div style="font-size: 1.5rem;">{emoji}</div>
                <div style="font-weight: 600; color: {color}; font-size: 0.8rem;">{name}</div>
                <div style="font-size: 0.7rem; color: #666;">{trait}</div>
            </div>
            """, unsafe_allow_html=True)

# ============================================
# FOOTER
# ============================================
st.markdown("---")
st.markdown("""
<div style="text-align: center; padding: 1rem; color: #888;">
    <p>🧘 Kundalini Activity Dashboard v2.0</p>
    <p style="font-size: 0.8rem;">Made with ❤️ for spiritual seekers</p>
</div>
""", unsafe_allow_html=True)