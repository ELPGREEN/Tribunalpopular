import re
with open("app.py", "r") as f:
    content = f.read()

# Make sure we use the investigate result and sync state
new_investigate = """@app.route('/investigate', methods=['POST'])
def investigate_route():
    data = request.get_json()
    index = data.get('index', 0)
    result = investigate(index)
    return jsonify(result)"""

# No changes needed to investigate_route if it already calls investigate(index)
# but ensure make_decision impacts are also applied to dimensional_state.

# Actually I already updated decide() in app.py to update dimensional_state.
# Let is make sure investigate() also updates it if needed.
# In my game_logic.py, investigate only impacts orcamento.

with open("app.py", "w") as f:
    f.write(content)
